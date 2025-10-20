import { google } from "googleapis";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { date, time, firstName, lastName, email, phone, message } = await req.json();

		if (!date || !time || !firstName || !lastName || !email) {
			return new Response(JSON.stringify({ error: "Missing required info" }), { status: 400 });
		}

		// Google auth
		const auth = new google.auth.JWT({
			email: process.env.GOOGLE_SERVICE_CLIENT_EMAIL,
			key: process.env.GOOGLE_SERVICE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
			scopes: ["https://www.googleapis.com/auth/calendar"],
		});
		const calendar = google.calendar({ version: "v3", auth });

		// Convert to full ISO date in JST
		const start = new Date(`${date}T${time}:00+09:00`);
		const end = new Date(start.getTime() + 30 * 60 * 1000);

		const event = {
			summary: "Free Coaching Session",
			description: `
        Name: ${firstName} ${lastName}
        Email: ${email}
        Phone: ${phone || "N/A"}
        Message: ${message || "N/A"}
      `,
			start: { dateTime: start.toISOString(), timeZone: "Asia/Tokyo" },
			end: { dateTime: end.toISOString(), timeZone: "Asia/Tokyo" },
			// extendedProperties can also store structured info if needed
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

		const response = await calendar.events.insert({
			calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
			requestBody: event,
		});

		return new Response(JSON.stringify({ success: true, eventLink: response.data.htmlLink }), { status: 200, headers: { "Content-Type": "application/json" } });
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
	}
}
