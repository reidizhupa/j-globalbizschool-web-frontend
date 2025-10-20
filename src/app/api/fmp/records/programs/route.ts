import { NextResponse } from "next/server";

let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

async function getToken() {
	if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;

	const auth = Buffer.from(`${process.env.FILEMAKER_USER}:${process.env.FILEMAKER_PASS}`).toString("base64");

	const res = await fetch(`${process.env.FILEMAKER_URL}/fmi/data/vLatest/databases/${process.env.FILEMAKER_DB}/sessions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Basic ${auth}`,
		},
		body: JSON.stringify({}),
	});

	const data = await res.json();
	cachedToken = data.response.token;
	tokenExpiresAt = Date.now() + 14 * 60 * 1000; // 14 min
	return cachedToken;
}

export async function GET() {
	const token = await getToken();

	const res = await fetch(`${process.env.FILEMAKER_URL}/fmi/data/v2/databases/${process.env.FILEMAKER_DB}/layouts/LearningProgramsListsENG/records`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	const data = await res.json();
	return NextResponse.json(data);
}
