// lib/db.ts
import { Client } from "@neondatabase/serverless";

export const query = async (text: string, params?: unknown[]) => {
	const client = new Client({
		connectionString: process.env.NEON_CONNECTION_STRING,
	});

	await client.connect();
	try {
		return await client.query(text, params);
	} finally {
		await client.end();
	}
};
