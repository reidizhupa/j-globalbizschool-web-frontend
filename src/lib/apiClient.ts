export interface ApiRequestOptions<ReqBody = undefined> {
	method?: string;
	headers?: Record<string, string>;
	body?: ReqBody;
	locale?: string; // will automatically set x-lang header
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "v1";

export async function apiRequest<T, ReqBody = undefined>(endpoint: string, { method = "GET", headers = {}, body, locale }: ApiRequestOptions<ReqBody> = {}): Promise<T> {
	const finalHeaders: Record<string, string> = {
		"Content-Type": "application/json",
		...(locale ? { "x-lang": locale } : {}),
		...headers,
	};

	const url = `${API_BASE_URL}/${API_VERSION}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

	try {
		const response = await fetch(url, {
			method,
			headers: finalHeaders,
			body: body ? JSON.stringify(body) : undefined,
			cache: "no-store",
		});

		if (!response.ok) {
			let json;
			try {
				json = await response.json();
			} catch {
				throw new Error(response.statusText);
			}

			const message = Array.isArray(json.message) ? json.message.join(", ") : json.message || response.statusText;

			throw new Error(message);
		}

		const data = await response.json();
		return data;
	} catch (err: unknown) {
		if (err instanceof Error) {
			throw err; // rethrow normal Error
		}
		// fallback for unexpected non-Error values
		throw new Error(String(err));
	}
}
