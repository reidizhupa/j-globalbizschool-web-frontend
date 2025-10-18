// app/api/free-coaching/available-slots/route.ts
import { weeklySlots } from "@/app/utils/slots";
import { google } from "googleapis";
import type { NextRequest } from "next/server";
import { format } from "date-fns";

// --- Types ---
interface CalendarEvent {
	start: { dateTime?: string; date?: string };
	end: { dateTime?: string; date?: string };
	summary?: string;
}

// --- Helpers ---
const parseTimeJST = (dateStr: string, timeStr: string): Date => {
	const [hourStr, minStr] = timeStr.split(":");
	return new Date(`${dateStr}T${hourStr.padStart(2, "0")}:${minStr.padStart(2, "0")}:00+09:00`);
};

const isSlotAvailable = (slotStart: Date, slotEnd: Date, events: CalendarEvent[]): boolean => {
	return !events.some((ev) => {
		const evStart = new Date(ev.start.dateTime || ev.start.date!);
		const evEnd = new Date(ev.end.dateTime || ev.end.date!);
		return slotStart < evEnd && slotEnd > evStart;
	});
};

const getAvailableSlotsForDate = (dateStr: string, events: CalendarEvent[]): string[] => {
	const dayOfWeek = new Date(`${dateStr}T00:00:00+09:00`).getDay();
	const slots = weeklySlots[dayOfWeek] || [];

	const nowJST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));

	return slots.filter((slot) => {
		const slotStart = parseTimeJST(dateStr, slot);
		const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000); // 30 min duration

		// Skip past slots if the date is today
		if (slotStart < nowJST && dateStr === format(nowJST, "yyyy-MM-dd")) {
			return false;
		}

		return isSlotAvailable(slotStart, slotEnd, events);
	});
};

// --- API Route ---
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const dateStr = body.date; // e.g. "2025-10-15"

		if (!dateStr) {
			return new Response(JSON.stringify({ error: "Missing date" }), { status: 400 });
		}

		// ✅ Load service account from environment variable
		const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT!);

		// ✅ Initialize JWT Auth with Google API
		const auth = new google.auth.JWT({
			email: serviceAccount.client_email,
			key: serviceAccount.private_key.replace(/\\n/g, "\n"), // important fix for escaped newlines
			scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
		});

		const calendar = google.calendar({ version: "v3", auth });

		// Tokyo start/end of day
		const startOfDay = new Date(`${dateStr}T00:00:00+09:00`);
		const endOfDay = new Date(`${dateStr}T23:59:59+09:00`);

		const eventsRes = await calendar.events.list({
			calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
			timeMin: startOfDay.toISOString(),
			timeMax: endOfDay.toISOString(),
			singleEvents: true,
			orderBy: "startTime",
		});

		const events: CalendarEvent[] = (eventsRes.data.items || []).map((event) => ({
			start: { dateTime: event.start?.dateTime ?? undefined, date: event.start?.date ?? undefined },
			end: { dateTime: event.end?.dateTime ?? undefined, date: event.end?.date ?? undefined },
			summary: event.summary || undefined,
		}));

		const availableSlots = getAvailableSlotsForDate(dateStr, events);

		return new Response(
			JSON.stringify({
				date: dateStr,
				events,
				availableSlots,
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);
	} catch (err: unknown) {
		console.error(err);
		const message = err instanceof Error ? err.message : "Unknown error occurred";
		return new Response(JSON.stringify({ error: message }), {
			status: 500,
		});
	}
}
