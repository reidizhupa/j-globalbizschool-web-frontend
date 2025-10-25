import { NextRequest, NextResponse } from "next/server";

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

// ✅ Always use a fixed API version, not "vLatest" — it can change across FileMaker updates
const FILEMAKER_API_VERSION = "v1";

async function getToken() {
	// ✅ Return cached token if still valid
	if (cachedToken && Date.now() < tokenExpiresAt) {
		return cachedToken;
	}

	const { FILEMAKER_USER, FILEMAKER_PASS, FILEMAKER_URL, FILEMAKER_DB } = process.env;
	if (!FILEMAKER_USER || !FILEMAKER_PASS || !FILEMAKER_URL || !FILEMAKER_DB) {
		throw new Error("Missing one or more FileMaker environment variables.");
	}

	const auth = Buffer.from(`${FILEMAKER_USER}:${FILEMAKER_PASS}`).toString("base64");

	// ✅ Use correct endpoint path
	const sessionUrl = `${FILEMAKER_URL}/fmi/data/${FILEMAKER_API_VERSION}/databases/${FILEMAKER_DB}/sessions`;

	const res = await fetch(sessionUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Basic ${auth}`,
		},
	});

	if (!res.ok) {
		const errorText = await res.text();
		console.error("❌ Failed to get token:", res.status, errorText);
		throw new Error(`Failed to get token: ${res.status} ${errorText}`);
	}

	const data = await res.json();

	if (!data?.response?.token) {
		throw new Error(`Token missing in response: ${JSON.stringify(data)}`);
	}

	cachedToken = data.response.token;
	tokenExpiresAt = Date.now() + 14 * 60 * 1000; // valid for 14 minutes
	console.log("✅ New token retrieved:", cachedToken);

	return cachedToken;
}

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
	try {
		if (!params?.slug) {
			throw new Error("Missing 'slug' parameter in request URL.");
		}

		const token = await getToken();
		const { FILEMAKER_URL, FILEMAKER_DB2 } = process.env;

		if (!FILEMAKER_URL || !FILEMAKER_DB2) {
			throw new Error("Missing FILEMAKER_URL or FILEMAKER_DB2 environment variable.");
		}

		const body = {
			query: [{ LearningProgramCode: `=${params.slug.toUpperCase()}` }],
			sort: [{ fieldName: "LearningProgramNameE", sortOrder: "ascend" }],
		};

		const apiUrl = `${FILEMAKER_URL}/fmi/data/${FILEMAKER_API_VERSION}/databases/${FILEMAKER_DB2}/layouts/LearningProgramApi/_find`;

		const res = await fetch(apiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(body),
		});

		const text = await res.text();

		let data;
		try {
			data = JSON.parse(text);
		} catch {
			throw new Error(`Failed to parse FileMaker response: ${text.slice(0, 200)}`);
		}

		if (!res.ok) {
			console.error("❌ FileMaker returned an error:", data);
			return NextResponse.json({ error: data }, { status: res.status });
		}

		console.log("✅ FileMaker query success");
		return NextResponse.json(data);
	} catch (error: unknown) {
		console.error("💥 API Error:", error);

		const message = error instanceof Error ? error.message : "An unexpected error occurred";

		return NextResponse.json({ error: message }, { status: 500 });
	}
}
