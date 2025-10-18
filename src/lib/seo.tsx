// lib/metadata.ts
import { getTranslations } from "next-intl/server";
import type { Metadata, ResolvingMetadata } from "next";

type PageProps = {
	params: Promise<{ locale: string }>;
};

/**
 * Reusable metadata generator with full SEO support
 * @param props - Page props containing locale
 * @param parent - Parent metadata
 * @param namespace - Translation namespace
 */
export async function generatePageMetadata(props: PageProps, parent: ResolvingMetadata, namespace: string): Promise<Metadata> {
	const { params } = props;
	const resolvedParams = await params;

	const t = await getTranslations({
		locale: resolvedParams.locale,
		namespace,
	});

	return {
		title: t("title"),
		description: t("title"),

		// Open Graph metadata
		openGraph: {
			title: t("title") || t("title"),
			description: t("title") || t("title"),
			type: "website",
			url: t("title"), // optional, can fallback to current page URL
			images: t("title") ? [{ url: t("title") }] : undefined,
		},

		// Twitter card metadata
		twitter: {
			card: "summary_large_image",
			title: t("title") || t("title"),
			description: t("title") || t("title"),
			images: t("title") ? [t("title")] : undefined,
		},

		icons: {
			icon: "/favicon/favicon.ico",
			shortcut: "/favicon/favicon.ico",
			apple: "/favicon/apple-touch-icon.png",
		},
		manifest: "/favicon/manifest.json",
		appleWebApp: {
			title: "J-Global Business School",
		},
	};
}
