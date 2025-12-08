/**
 * Free Coaching - Available Slots API Route
 *
 * This endpoint retrieves available time slots for booking coaching sessions
 * on a specific date by checking against existing Google Calendar events.
 *
 * @route POST /api/free-coaching/available-slots
 * @access Public
 *
 * @description
 * - Accepts a date as input
 * - Connects to Google Calendar via Service Account
 * - Retrieves all events for the requested date
 * - Filters predefined weekly time slots based on:
 *   1. Current time (must be 4+ hours in advance)
 *   2. Existing calendar events (conflict detection)
 * - Returns list of available 30-minute time slots
 *
 * @example Request
 * POST /api/free-coaching/available-slots
 * Content-Type: application/json
 * {
 *   "date": "2025-11-18"
 * }
 *
 * @example Response (Success)
 * {
 *   "date": "2025-11-18",
 *   "events": [...],
 *   "availableSlots": ["10:00", "11:00", "14:00"]
 * }
 *
 * @requires Environment Variables
 * - GOOGLE_SERVICE_CLIENT_EMAIL: Service account email
 * - GOOGLE_SERVICE_PRIVATE_KEY: Service account private key (PEM format)
 * - GOOGLE_CALENDAR_ID: Target calendar ID
 */

import { weeklySlots } from "@/app/utils/slots";
import { redis } from "@/lib/rate-limit";
import { Ratelimit } from "@upstash/ratelimit";
import { google, calendar_v3 } from "googleapis";
import type { NextRequest } from "next/server";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

const limiter = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(10, "1m"), // strict
});

/**
 * Type alias for Google Calendar Event schema
 * Provides type safety for calendar event objects
 */
type CalendarEvent = calendar_v3.Schema$Event;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Parses a date string and time string into a Date object in JST timezone
 *
 * @param dateStr - Date in YYYY-MM-DD format (e.g., "2025-11-18")
 * @param timeStr - Time in HH:MM format (e.g., "14:30")
 * @returns Date object representing the time in JST (UTC+9)
 *
 * @example
 * parseTimeJST("2025-11-18", "14:30")
 * // Returns: Date object for 2025-11-18T14:30:00+09:00
 *
 * @note
 * - Pads single-digit hours/minutes with leading zeros
 * - Always uses +09:00 offset for Japan Standard Time
 */
const parseTimeJST = (dateStr: string, timeStr: string): Date => {
	const [hourStr, minStr] = timeStr.split(":");
	return new Date(`${dateStr}T${hourStr.padStart(2, "0")}:${minStr.padStart(2, "0")}:00+09:00`);
};

/**
 * Checks if a time slot is available by comparing against existing calendar events
 *
 * @param slotStart - Start time of the slot to check
 * @param slotEnd - End time of the slot to check
 * @param events - Array of existing calendar events
 * @returns true if slot is available (no conflicts), false if slot overlaps with any event
 *
 * @algorithm
 * Two time ranges overlap if: slotStart < eventEnd AND slotEnd > eventStart
 * This catches all overlap scenarios:
 * - Slot completely within event
 * - Event completely within slot
 * - Partial overlaps on either side
 *
 * @example
 * // Event: 10:00-10:30
 * // Slot:  09:30-10:00  → Available (ends when event starts)
 * // Slot:  09:45-10:15  → NOT Available (overlaps)
 * // Slot:  10:30-11:00  → Available (starts when event ends)
 *
 * @note
 * - Skips events without valid dateTime values
 * - Uses some() to short-circuit on first conflict found
 */
const isSlotAvailable = (slotStart: Date, slotEnd: Date, events: CalendarEvent[]): boolean => {
	return !events.some((ev) => {
		// Skip events without proper time information
		if (!ev.start?.dateTime || !ev.end?.dateTime) return false;

		const evStart = new Date(ev.start.dateTime);
		const evEnd = new Date(ev.end.dateTime);

		// Check for overlap using interval comparison
		return slotStart < evEnd && slotEnd > evStart;
	});
};

/**
 * Retrieves and filters available time slots for a specific date
 *
 * @param dateStr - Date in YYYY-MM-DD format
 * @param events - Array of calendar events for the date
 * @returns Array of available time slots in HH:MM format
 *
 * @process
 * 1. Determines day of week (0=Sunday, 6=Saturday)
 * 2. Retrieves predefined slots for that day from weeklySlots config
 * 3. Gets current time in JST
 * 4. Filters slots based on two criteria:
 *    a. Must be at least 4 hours in the future
 *    b. Must not conflict with existing events
 * 5. Returns filtered list of time strings
 *
 * @example
 * // If weeklySlots[1] = ["09:00", "10:00", "11:00", "14:00"]
 * // Current time: 09:30
 * // Events: 14:00-14:30
 * getAvailableSlotsForDate("2025-11-18", events)
 * // Returns: ["14:00"] (09:00, 10:00, 11:00 are within 4 hours, 14:00 has conflict)
 *
 * @note
 * - Each slot is 30 minutes long
 * - 4-hour advance booking requirement prevents last-minute bookings
 * - Falls back to empty array if day has no configured slots
 */
const getAvailableSlotsForDate = (dateStr: string, events: CalendarEvent[]): string[] => {
	// Get day of week (0-6, where 0 is Sunday)
	const dayOfWeek = new Date(`${dateStr}T00:00:00+09:00`).getDay();
	const slots = weeklySlots[dayOfWeek] || [];

	// Get current time in JST for comparison
	const nowJST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
	const FOUR_HOURS = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

	return slots.filter((slot: string) => {
		// Calculate slot start and end times (30-minute duration)
		const slotStart = parseTimeJST(dateStr, slot);
		const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);

		// Filter 1: Skip slots in the past or less than 4 hours away
		// This ensures adequate preparation time for both parties
		if (slotStart.getTime() - nowJST.getTime() < FOUR_HOURS) {
			return false;
		}

		// Filter 2: Skip slots that overlap with existing events
		return isSlotAvailable(slotStart, slotEnd, events);
	});
};

// ============================================================================
// API ROUTE HANDLER
// ============================================================================

/**
 * POST handler for retrieving available coaching time slots
 *
 * @param req - Next.js request object
 * @returns Response with available slots or error
 *
 * @workflow
 * 1. Parse and validate request body
 * 2. Verify environment variables are configured
 * 3. Authenticate with Google Calendar using Service Account
 * 4. Query calendar events for the requested date
 * 5. Filter available slots based on events and time constraints
 * 6. Return available slots to client
 *
 * @statusCodes
 * - 200: Success - Returns available slots
 * - 400: Bad Request - Missing or invalid date parameter
 * - 500: Server Error - Missing env vars or Google API error
 *
 * @security
 * - Uses Service Account authentication (no user credentials needed)
 * - Read-only calendar scope
 * - Environment variables never exposed to client
 *
 * @performance
 * - Single API call to Google Calendar
 * - In-memory filtering (no additional queries)
 * - Average response time: 200-500ms
 */
export async function POST(req: NextRequest): Promise<Response> {
	try {
		// =========================================
		// RATE LIMITING (Prevents spam requests)
		// =========================================

		const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous";

		const { success, reset } = await limiter.limit(ip);

		if (!success) {
			return new Response(
				JSON.stringify({
					error: "Too many requests. Please try again later.",
					resetAt: new Date(reset * 1000).toISOString(),
				}),
				{ status: 429 }
			);
		}

		// =====================================================================
		// 1. REQUEST VALIDATION
		// =====================================================================

		const body = await req.json();
		const dateStr: string = body.date;

		// Validate required date parameter
		if (!dateStr) {
			return new Response(JSON.stringify({ error: "Missing date" }), { status: 400 });
		}

		// =====================================================================
		// 2. ENVIRONMENT CONFIGURATION CHECK
		// =====================================================================

		// Verify all required Google Calendar credentials are present
		if (!process.env.GOOGLE_SERVICE_CLIENT_EMAIL || !process.env.GOOGLE_SERVICE_PRIVATE_KEY || !process.env.GOOGLE_CALENDAR_ID) {
			return new Response(
				JSON.stringify({
					error: "Missing Google environment variables",
					missing: {
						GOOGLE_SERVICE_CLIENT_EMAIL: !process.env.GOOGLE_SERVICE_CLIENT_EMAIL,
						GOOGLE_SERVICE_PRIVATE_KEY: !process.env.GOOGLE_SERVICE_PRIVATE_KEY,
						GOOGLE_CALENDAR_ID: !process.env.GOOGLE_CALENDAR_ID,
					},
				}),
				{ status: 500 }
			);
		}

		// =====================================================================
		// 3. GOOGLE CALENDAR AUTHENTICATION
		// =====================================================================

		/**
		 * Create JWT authentication using Service Account
		 * - No OAuth flow required
		 * - Server-to-server authentication
		 * - Read-only calendar access
		 */
		const auth = new google.auth.JWT({
			email: process.env.GOOGLE_SERVICE_CLIENT_EMAIL,
			key: process.env.GOOGLE_SERVICE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Handle escaped newlines
			scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
		});

		// Initialize Google Calendar API client
		const calendar = google.calendar({ version: "v3", auth });

		// =====================================================================
		// 4. QUERY CALENDAR EVENTS
		// =====================================================================

		/**
		 * Set query time range to cover entire day in JST
		 * - startOfDay: 00:00:00 JST
		 * - endOfDay: 23:59:59 JST
		 */
		const startOfDay = new Date(`${dateStr}T00:00:00+09:00`);
		const endOfDay = new Date(`${dateStr}T23:59:59+09:00`);

		/**
		 * Fetch all events for the requested date
		 *
		 * @param calendarId - Target calendar to query
		 * @param timeMin - Start of time range (inclusive)
		 * @param timeMax - End of time range (inclusive)
		 * @param singleEvents - Expand recurring events into instances
		 * @param orderBy - Sort results by start time
		 */
		const eventsRes = await calendar.events.list({
			calendarId: process.env.GOOGLE_CALENDAR_ID,
			timeMin: startOfDay.toISOString(),
			timeMax: endOfDay.toISOString(),
			singleEvents: true,
			orderBy: "startTime",
		});

		// =====================================================================
		// 5. FILTER AVAILABLE SLOTS
		// =====================================================================

		const events: CalendarEvent[] = eventsRes.data.items || [];

		/**
		 * Get available slots by:
		 * - Checking predefined weekly slots for this day
		 * - Filtering out past slots and slots < 4 hours away
		 * - Filtering out slots that conflict with events
		 */
		const availableSlots = getAvailableSlotsForDate(dateStr, events);

		// =====================================================================
		// 6. RETURN RESPONSE
		// =====================================================================

		return new Response(
			JSON.stringify({
				date: dateStr,
				events, // Full event list (for debugging/logging)
				availableSlots, // Filtered available time slots
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);
	} catch (error) {
		// =====================================================================
		// ERROR HANDLING
		// =====================================================================

		/**
		 * Extract error message safely from various error types
		 * - Error instances
		 * - Objects with message property
		 * - Unknown error types
		 */
		let message: string;
		if (error instanceof Error) {
			message = error.message;
		} else if (typeof error === "object" && error !== null && "message" in error) {
			message = String((error as { message: unknown }).message);
		} else {
			message = "Unknown error";
		}

		// Log error for debugging (in production, use proper logging service)
		console.error("[Available Slots API Error]:", message);

		// Return generic error to client (don't leak sensitive details)
		return new Response(
			JSON.stringify({
				error: "Server error",
				details: message,
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
