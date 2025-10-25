import { NextResponse } from "next/server";

export async function GET() {
	const url = `${process.env.FILEMAKER_URL}/fmi/data/vLatest/databases/${process.env.FILEMAKER_DB}/sessions`;

	const auth = Buffer.from(`${process.env.FILEMAKER_USER}:${process.env.FILEMAKER_PASS}`).toString("base64");

	const res = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Basic ${auth}`,
		},
		body: JSON.stringify({}),
	});

	if (!res.ok) {
		const text = await res.text();
		return NextResponse.json({ error: "Failed to get token", details: text }, { status: res.status });
	}

	const data = await res.json();
	const token = data?.response?.token;

	return NextResponse.json({ token });
}
