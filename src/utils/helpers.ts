import { LINKS } from "@/lib/links";

export function getLink(key: keyof typeof LINKS, lang: string = "jp") {
	const link = LINKS[key];
	if (!link) throw new Error(`Link key "${key}" not found`);

	return link.langUrls?.[lang] || link.url;
}

/**
 * Generate a program link dynamically
 */
export function getProgramLink(programCode: string, lang: string = "jp") {
	const baseUrl = lang === "en" ? "https://fms.j-globalbizschool.com/fmi/webd/IBSApplication?script=JbsPrograms&param=" : "https://fms.j-globalbizschool.com/fmi/webd/IBSApplication?script=JbsProgramsJpn&param=";

	return `${baseUrl}${programCode}`;
}
