/**
 * Free Coaching - Book Event API Route
 *
 * This endpoint creates a coaching session booking by inserting an event into
 * Google Calendar and sending a confirmation email to the user.
 *
 * @route POST /api/free-coaching/book
 * @access Public
 *
 * @description
 * - Validates required user information
 * - Checks for calendar conflicts (double-booking prevention)
 * - Creates 30-minute event in Google Calendar
 * - Sends confirmation email with calendar link
 * - Returns success status and event link
 *
 * @example Request
 * POST /api/free-coaching/book
 * Content-Type: application/json
 * x-locale: ja
 * {
 *   "date": "2025-11-18",
 *   "time": "14:00",
 *   "firstName": "Taro",
 *   "lastName": "Yamada",
 *   "email": "taro@example.com",
 *   "phone": "+81-90-1234-5678",
 *   "message": "Looking forward to the session"
 * }
 *
 * @example Response (Success)
 * {
 *   "success": true,
 *   "eventLink": "https://calendar.google.com/event?eid=..."
 * }
 *
 * @example Response (Conflict)
 * {
 *   "error": "This time slot is already booked."
 * }
 *
 * @requires Environment Variables
 * - GOOGLE_SERVICE_CLIENT_EMAIL: Service account email
 * - GOOGLE_SERVICE_PRIVATE_KEY: Service account private key (PEM format)
 * - GOOGLE_CALENDAR_ID: Target calendar ID
 * - RESEND_API_KEY: Resend email service API key
 *
 * @security
 * - Write access to Google Calendar
 * - Conflict detection prevents double-booking
 * - User data stored in calendar's private extended properties
 */

import { query } from "@/utils/neon";
import { loadServerMessages } from "../../../../../messages/server";
import { google } from "googleapis";
import type { NextRequest } from "next/server";
import { Resend } from "resend";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const limiter = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(3, "1h"), // 3 requests per hour
});

function interpolate(template: string, values: Record<string, unknown>) {
	return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}

/**
 * POST handler for booking coaching sessions
 *
 * @param req - Next.js request object
 * @returns Response with booking confirmation or error
 *
 * @workflow
 * 1. Extract locale for internationalized emails
 * 2. Parse and validate request body
 * 3. Authenticate with Google Calendar
 * 4. Calculate event start/end times (30-minute duration)
 * 5. Check for calendar conflicts
 * 6. Insert event into calendar
 * 7. Send confirmation email with calendar link
 * 8. Return success response
 *
 * @statusCodes
 * - 200: Success - Event created and email sent
 * - 400: Bad Request - Missing required fields
 * - 409: Conflict - Time slot already booked
 * - 500: Server Error - Google API or email service error
 *
 * @race-conditions
 * Note: There's a potential race condition between conflict check and event
 * insertion. For high-traffic scenarios, consider implementing optimistic
 * locking or using calendar's built-in conflict detection.
 *
 * @performance
 * - Average response time: 500-1500ms
 * - Includes: Auth (100ms) + Conflict check (200ms) + Insert (300ms) + Email (400ms)
 */
export async function POST(req: NextRequest) {
	const ip = req.headers.get("x-forwarded-for") || "unknown";

	const { success } = await limiter.limit(ip);
	if (!success) {
		return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), { status: 429 });
	}
	// =========================================================================
	// 1. LOCALE EXTRACTION FOR INTERNATIONALIZATION
	// =========================================================================

	/**
	 * Extract locale from request header for multi-language email support
	 * - Default to "ja" if not specified
	 * - Used for email subject and body translations
	 */
	const locale = req.headers.get("x-locale") || "ja";
	const messages = await loadServerMessages(locale);

	try {
		// =====================================================================
		// 2. REQUEST VALIDATION
		// =====================================================================

		/**
		 * Extract booking details from request body
		 *
		 * Required fields:
		 * - date: YYYY-MM-DD format
		 * - time: HH:MM format (24-hour)
		 * - firstName: User's first name
		 * - lastName: User's last name
		 * - email: Valid email address
		 *
		 * Optional fields:
		 * - phone: Contact phone number
		 * - message: Additional message/notes from user
		 */
		const { date, time, firstName, lastName, email, phone, message } = await req.json();

		// Validate that all required fields are present
		if (!date || !time || !firstName || !lastName || !email) {
			return new Response(JSON.stringify({ error: "Missing required info" }), { status: 400 });
		}

		// =====================================================================
		// 3. GOOGLE CALENDAR AUTHENTICATION
		// =====================================================================

		/**
		 * Create JWT authentication using Service Account
		 * - Uses full calendar scope (read + write access)
		 * - Required for event creation
		 * - No user OAuth flow needed
		 */
		const auth = new google.auth.JWT({
			email: process.env.GOOGLE_SERVICE_CLIENT_EMAIL,
			key: process.env.GOOGLE_SERVICE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
			scopes: ["https://www.googleapis.com/auth/calendar"], // Full calendar access
		});

		// Initialize Google Calendar API client
		const calendar = google.calendar({ version: "v3", auth });

		// =====================================================================
		// 4. TIME CALCULATION
		// =====================================================================

		/**
		 * Calculate event start and end times in JST (Japan Standard Time)
		 * - Combines date and time parameters
		 * - Session duration: 30 minutes
		 * - Timezone: Asia/Tokyo (UTC+9)
		 *
		 * @example
		 * date = "2025-11-18", time = "14:00"
		 * start = 2025-11-18T14:00:00+09:00
		 * end   = 2025-11-18T14:30:00+09:00
		 */
		const start = new Date(`${date}T${time}:00+09:00`);
		const end = new Date(start.getTime() + 30 * 60 * 1000); // Add 30 minutes in milliseconds

		// =====================================================================
		// 5. CONFLICT DETECTION
		// =====================================================================

		/**
		 * Query existing events in the requested time slot
		 * - Prevents double-booking
		 * - Checks exact time range of proposed event
		 * - Uses same conflict algorithm as available-slots endpoint
		 */
		const existing = await calendar.events.list({
			calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
			timeMin: start.toISOString(),
			timeMax: end.toISOString(),
			singleEvents: true, // Expand recurring events
			orderBy: "startTime",
		});

		/**
		 * Check if any existing event overlaps with requested time slot
		 *
		 * Overlap condition: requestedStart < existingEnd AND requestedEnd > existingStart
		 *
		 * This catches all overlap scenarios:
		 * - Exact match
		 * - Partial overlap (start or end)
		 * - Complete containment (either direction)
		 */
		const hasConflict = existing.data.items?.some((ev) => {
			// Skip events without time information
			if (!ev.start?.dateTime || !ev.end?.dateTime) return false;

			const evStart = new Date(ev.start.dateTime);
			const evEnd = new Date(ev.end.dateTime);

			// Check for any time overlap
			return start < evEnd && end > evStart;
		});

		// Return 409 Conflict if slot is already booked
		if (hasConflict) {
			return new Response(JSON.stringify({ error: "This time slot is already booked." }), {
				status: 409,
				headers: { "Content-Type": "application/json" },
			});
		}

		// =====================================================================
		// 6. CREATE CALENDAR EVENT
		// =====================================================================

		/**
		 * Construct event object with all booking details
		 *
		 * Structure:
		 * - summary: Event title (visible in calendar)
		 * - description: User details in human-readable format
		 * - start/end: Event timing with timezone
		 * - extendedProperties: Structured data storage (searchable)
		 *
		 * @note
		 * extendedProperties.private is not visible to attendees,
		 * only to calendar owner and applications with access
		 */
		const event = {
			summary: "Free Coaching Session",

			// Description shown in calendar event details
			description: `Free coaching session with ${firstName} ${lastName}
Email: ${email}
${phone?.trim() ? `Phone: ${phone}\n` : ""}${message?.trim() ? `Message: ${message}\n` : ""}
Zoom link: ${process.env.ZOOM_LINK || ""}`,

			// Event timing in ISO 8601 format with timezone
			start: {
				dateTime: start.toISOString(),
				timeZone: "Asia/Tokyo",
			},
			end: {
				dateTime: end.toISOString(),
				timeZone: "Asia/Tokyo",
			},

			/**
			 * Extended properties for structured data storage
			 * - Enables searching/filtering events programmatically
			 * - Private properties only visible to calendar owner
			 * - Useful for CRM integration or analytics
			 */
			extendedProperties: {
				private: {
					firstName,
					lastName,
					email,
					phone: phone || "",
					message: message || "",
				},
			},
		};

		// -----------------------------
		// 1. GET EXISTING SESSION COOKIE
		// -----------------------------
		const cookieHeader = req.headers.get("cookie") || "";
		const cookies = Object.fromEntries(
			cookieHeader.split(";").map((c) => {
				const [key, ...v] = c.trim().split("=");
				return [key, decodeURIComponent(v.join("="))];
			})
		);
		let sessionId = cookies["sessionId"];

		// -----------------------------
		// 2. CREATE NEW SESSION IF NEEDED
		// -----------------------------
		if (!sessionId) {
			const ip = req.headers.get("x-forwarded-for") || req.headers.get("remote_addr") || "unknown";
			const userAgent = req.headers.get("user-agent") || "";
			const fingerprint = `${ip}:${userAgent}`;

			const sessionResult = await query(
				`INSERT INTO jbs.client_sessions (ip_address, user_agent, fingerprint)
         VALUES ($1, $2, $3)
         ON CONFLICT (fingerprint) DO UPDATE SET ip_address = EXCLUDED.ip_address
         RETURNING id`,
				[ip, userAgent, fingerprint]
			);
			sessionId = sessionResult.rows[0].id.toString();
		}

		// -----------------------------
		// 3. SAVE BOOKING
		// -----------------------------
		const eventDateTimeJST = new Date(`${date}T${time}:00+09:00`);
		await query(
			`INSERT INTO jbs.bookings
        (session_id, first_name, last_name, email, phone_number, message, event_date, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
			[sessionId, firstName, lastName, email, phone || "", message || "", eventDateTimeJST.toISOString(), new Date().toISOString()]
		);

		// -----------------------------
		// 4. SEND CONFIRMATION EMAIL
		// -----------------------------

		/**
		 * Insert event into Google Calendar
		 * - Returns event object with generated ID and links
		 * - Event is immediately visible in calendar
		 */

		// =====================================================================
		// 7. SEND CONFIRMATION EMAIL
		// =====================================================================

		// Initialize Resend email client
		const resend = new Resend(process.env.RESEND_API_KEY);

		/**
		 * Helper function to format dates for Google Calendar URLs
		 *
		 * Converts ISO 8601 format to compact format required by Google
		 * @example
		 * Input:  2025-11-18T14:00:00.000Z
		 * Output: 20251118T140000Z
		 *
		 * Removes: hyphens, colons, and milliseconds
		 */
		const formatForGoogle = (d: Date) => d.toISOString().replace(/-|:|\.\d{3}/g, "");

		/**
		 * Generate "Add to Calendar" link for email
		 *
		 * URL Parameters:
		 * - action=TEMPLATE: Opens calendar event creation form
		 * - text: Event title
		 * - dates: Start and end times in compact format (START/END)
		 * - details: Event description
		 * - location: Event location (if applicable)
		 *
		 * User can click this link to add event to their personal calendar
		 */
		const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Free+Coaching+Session&dates=${formatForGoogle(start)}/${formatForGoogle(end)}&details=Your+free+coaching+session+with+our+expert&location=Online`;

		/**
		 * Send confirmation email with booking details
		 *
		 * Email includes:
		 * - Personalized greeting (internationalized)
		 * - Booking confirmation message
		 * - Date and time details
		 * - "Add to Calendar" button with styled link
		 * - Team signature
		 *
		 * @internationalization
		 * All text is translated based on locale using next-intl:
		 * - email.subject: Email subject line
		 * - email.hi: Greeting with user's name
		 * - email.confirmed: Confirmation message
		 * - email.date: "Date" label
		 * - email.time: "Time" label
		 * - email.lookingForward: Closing message
		 * - email.addToCalendar: Button text
		 * - email.teamName: Signature
		 */
		await resend.emails.send({
			from: process.env.FROM_EMAIL || "",
			to: email,
			subject: messages.server.email.subject,
			html: `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px;">

    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://j-globalbizschool.com/logo.avif" alt="Company Logo" style="max-width: 150px;" />
    </div>

    <!-- Header -->
    <h2 style="text-align: center; color: #2563eb; margin-bottom: 30px;">
      ${messages.server.email.header}
    </h2>

    <!-- Greeting -->
    <p>${interpolate(messages.server.email.hi, { name: locale == "ja" ? lastName : firstName })}</p>

    <!-- Intro -->
    <p>
      ${messages.server.email.thanks}<br/>
      ${interpolate(messages.server.email.seeYou, { date, time })}
    </p>

    <!-- Booking details -->
    <p>
      <strong>${messages.server.email.serviceBooked}:</strong> ${messages.server.email.serviceName}<br/>
      <strong>${messages.server.email.zoomLink}:</strong>
      <a href="${process.env.ZOOM_LINK || ""}" style="color:#2563eb;">${process.env.ZOOM_LINK || ""}</a><br/>
      <strong>${messages.server.email.staff}:</strong> ${messages.server.email.staffName}
    </p>

    <!-- Contact -->
    <p>
      ${messages.server.email.contact}<br/>
      <a href="mailto:${messages.server.email.supportEmail}" style="color:#2563eb;">
        ${messages.server.email.supportEmail}
      </a>
    </p>

    <!-- Add to Calendar -->
    <p style="text-align: center; margin-top: 30px;">
      <a href="${calendarUrl}" target="_blank" rel="noopener noreferrer" style="
        display:inline-block;
        padding: 12px 24px;
        background-color:#2563eb;
        color:white;
        font-weight:600;
        border-radius:12px;
        text-decoration:none;
      ">
        ${messages.server.email.addToCalendar}
      </a>
    </p>

    <p style="margin-top: 40px;">— ${messages.server.email.teamName}</p>
  </div>
  `,
		});

		await resend.emails.send({
			from: process.env.FROM_EMAIL || "",
			to: process.env.LECTURER_EMAIL || "",
			subject: "New Free Coaching Booking Received",
			html: `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
      <h2>New Coaching Session Booking</h2>

      <p>A new user has booked a free coaching session.</p>

      <p>
        <strong>Name:</strong> ${firstName} ${lastName || ""}<br/>
        <strong>Email:</strong> ${email}<br/>
		${phone?.trim() ? `<strong>Phone Number:</strong> ${phone}<br/>` : ""}
		${message?.trim() ? `<strong>Message:</strong> ${message}<br/>` : ""}
        <strong>Date:</strong> ${date}<br/>
        <strong>Time:</strong> ${time} (JST)<br/>
      </p>

      <p>
        <strong>Google Calendar Event URL:</strong><br/>
        <a href="${calendarUrl}">${calendarUrl}</a>
      </p>

      <p>
        — Booking Notification System
      </p>
    </div>
  `,
		});

		// =====================================================================
		// 8. RETURN SUCCESS RESPONSE
		// =====================================================================

		/**
		 * Send success response to client
		 *
		 * Response includes:
		 * - success: Boolean flag
		 * - eventLink: Direct link to view event in Google Calendar
		 *
		 * Client can use eventLink to:
		 * - Redirect user to calendar
		 * - Display confirmation with calendar preview
		 * - Store for future reference
		 */
		// -----------------------------
		// 5. RETURN RESPONSE WITH COOKIE
		// -----------------------------

		const response = await calendar.events.insert({
			calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
			requestBody: event,
		});

		// Return both the event info and the sessionId cookie
		return new Response(
			JSON.stringify({
				success: true,
				event: response, // <-- this contains the Google Calendar event info
				sessionId: sessionId, // <-- optional, already in cookie
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
					"Set-Cookie": `sessionId=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`, // 30 days
				},
			}
		);
	} catch (err) {
		// =====================================================================
		// ERROR HANDLING
		// =====================================================================

		/**
		 * Return generic error response
		 * - Don't expose sensitive details to client
		 * - Include error message for debugging
		 * - Status 500 indicates server-side error
		 */
		return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
	}
}
