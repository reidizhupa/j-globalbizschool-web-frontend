import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";
import Aoscompo from "../utils/aos";
import { Inter } from "next/font/google";

const inter = Inter({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-inter", // optional for Tailwind usage
});

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
	const { locale } = await params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	return (
		<html lang={locale} className={inter.variable}>
			<body className={inter.className}>
				<NextIntlClientProvider>
					<Aoscompo>{children}</Aoscompo>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
