// --- types.ts ---
export interface LinkEntry {
	url: string;
	langUrls?: Partial<Record<string, string>>;
}

// --- links.ts ---
export const LINKS: Record<string, LinkEntry> = {
	login: {
		url: "https://fms.j-globalbizschool.com/fmi/webd/IBSApplication?script=login",
		langUrls: {
			en: "https://fms.j-globalbizschool.com/fmi/webd/IBSApplication?script=login&param=en",
		},
	},
	freeTrial: {
		url: "https://fms.j-globalbizschool.com/fmi/webd/IBSApplication?script=trial",
		langUrls: {
			en: "https://fms.j-globalbizschool.com/fmi/webd/IBSApplication?script=trialEn",
		},
	},
	freeCoaching: {
		url: "https://www.j-globalbizschool.com/en/service-page/freecoaching-booking-en",
		langUrls: {
			en: "https://www.j-globalbizschool.com/en/service-page/freecoaching-booking-en",
		},
	},
	joinPrograms: {
		url: "https://fms.j-globalbizschool.com/fmi/webd/IBSApplication",
		langUrls: {
			en: "https://fms.j-globalbizschool.com/fmi/webd/IBSApplication?script=homepageEn",
		},
	},
};
