import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import getRequestConfig from "@/i18n/request";
import Navbar from "@/app/components/Navbar";
import HeroSection from "@/app/components/HeroSection";
type GenerateMetadataParams = {
	params: {
		locale: string;
	};
};

export async function generateMetadata({ params }: GenerateMetadataParams) {
	const { locale } = await params;

	const configFn = await getRequestConfig;

	const messages = await configFn({
		requestLocale: Promise.resolve(locale),
	});

	console.log(messages, "messages");
	return {
		title: (messages.messages && messages.messages["title"]) || "Default Title",
	};
}

export default function HomePage() {
	const t = useTranslations("HomePage");
	return (
		<>
			<HeroSection />
			<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
				<h1 className="text-4xl font-bold text-gray-900 mb-6">{t("title")} also a blog</h1>
				<Link href="/about" className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200">
					{t("about")}
				</Link>
			</div>
		</>
	);
}
