interface LinkEntry {
	// The base URL (can be anything)
	url: string;
	// Optional per-language variants
	langUrls?: Partial<Record<string, string>>;
}

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

export function getLink(key: keyof typeof LINKS, lang: string = "jp") {
	const link = LINKS[key];
	if (!link) throw new Error(`Link key "${key}" not found`);

	// Return language-specific version if it exists
	return link.langUrls?.[lang] || link.url;
}
