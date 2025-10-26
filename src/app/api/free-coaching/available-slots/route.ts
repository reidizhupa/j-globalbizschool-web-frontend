// app/api/free-coaching/available-slots/route.ts
import { weeklySlots } from "@/app/utils/slots";
import { google, calendar_v3 } from "googleapis";
import type { NextRequest } from "next/server";
import { format } from "date-fns";

// --- Types ---
type CalendarEvent = calendar_v3.Schema$Event;

const parseTimeJST = (dateStr: string, timeStr: string) => {
	const [hourStr, minStr] = timeStr.split(":");
	return new Date(`${dateStr}T${hourStr.padStart(2, "0")}:${minStr.padStart(2, "0")}:00+09:00`);
};

const isSlotAvailable = (slotStart: Date, slotEnd: Date, events: CalendarEvent[]) => {
	return !events.some((ev) => {
		if (!ev.start?.dateTime || !ev.end?.dateTime) return false;
		const evStart = new Date(ev.start.dateTime);
		const evEnd = new Date(ev.end.dateTime);
		return slotStart < evEnd && slotEnd > evStart;
	});
};

const getAvailableSlotsForDate = (dateStr: string, events: CalendarEvent[]) => {
	const dayOfWeek = new Date(`${dateStr}T00:00:00+09:00`).getDay();
	const slots = weeklySlots[dayOfWeek] || [];

	// current time in JST
	const nowJST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));

	return slots.filter((slot: string) => {
		const slotStart = parseTimeJST(dateStr, slot);
		const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000); // 30 min slot

		// skip past slots if the date is today
		if (slotStart < nowJST && dateStr === format(nowJST, "yyyy-MM-dd")) {
			return false;
		}

		return isSlotAvailable(slotStart, slotEnd, events);
	});
};
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const dateStr: string = body.date;
		if (!dateStr) {
			return new Response(JSON.stringify({ error: "Missing date" }), { status: 400 });
		}

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

		// --- Authenticate with Google ---
		const auth = new google.auth.JWT({
			email: process.env.GOOGLE_SERVICE_CLIENT_EMAIL,
			key: process.env.GOOGLE_SERVICE_PRIVATE_KEY.replace(/\\n/g, "\n"),
			scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
		});

		const calendar = google.calendar({ version: "v3", auth });

		const startOfDay = new Date(`${dateStr}T00:00:00+09:00`);
		const endOfDay = new Date(`${dateStr}T23:59:59+09:00`);

		const eventsRes = await calendar.events.list({
			calendarId: process.env.GOOGLE_CALENDAR_ID,
			timeMin: startOfDay.toISOString(),
			timeMax: endOfDay.toISOString(),
			singleEvents: true,
			orderBy: "startTime",
		});

		const events = eventsRes.data.items || [];
		const availableSlots = getAvailableSlotsForDate(dateStr, events);

		return new Response(JSON.stringify({ date: dateStr, events, availableSlots }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		// Detailed error for client
		const errorMessage = (err as any)?.response?.data || (err as Error).message;
		return new Response(JSON.stringify({ error: "Server error", details: errorMessage }), { status: 500, headers: { "Content-Type": "application/json" } });
	}
}
