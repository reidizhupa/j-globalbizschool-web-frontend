import { apiRequest } from "./apiClient";

export interface FreeTrialFormData {
	firstName: string;
	lastName: string;
	email: string;
}

// Define the expected API response type
interface FreeTrialResponse {
	success: boolean;
	message?: string;
}

export async function submitFreeTrialForm(data: FreeTrialFormData, lang: string) {
	const payload = {
		first_name: data.firstName,
		last_name: data.lastName,
		email: data.email,
	};

	return apiRequest<FreeTrialResponse, typeof payload>("/free-trial-form", {
		method: "POST",
		body: payload,
		headers: {
			"x-lang": lang,
		},
	});
}
