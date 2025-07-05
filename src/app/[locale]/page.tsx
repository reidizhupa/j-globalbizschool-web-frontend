import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import getRequestConfig from "@/i18n/request";
import { getLocale } from "next-intl/server";
import Navbar from "@/app/components/Navbar";
type GenerateMetadataParams = {
	params: {
		locale: string;
	};
};

export default function HomePage() {
	const t = useTranslations("HomePage");
	return (
		<>
			<Navbar />
			<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
				<h1 className="text-4xl font-bold text-gray-900 mb-6">{t("title")}</h1>
				<Link href="/about" className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200">
					{t("about")}
				</Link>
			</div>
		</>
	);
}
