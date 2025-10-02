"use client";

import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "../LanguageSwitcher";
import { useLocale, useTranslations } from "next-intl";
import { getLink } from "@/lib/links";
import { useScroll } from "@/app/hoooks/useScroll";

export default function Page() {
	const currentLocale = useLocale();
	const scrolled = useScroll(10);

	const tHome = useTranslations("homepage");

	return (
		<div className="relative min-h-screen overflow-hidden">
			{/* Background Image */}
			<div className="absolute inset-0 -z-20">
				<Image
					src="/img/sun-tornado.svg"
					alt="Background pattern"
					fill
					className="object-cover" // or "object-repeat"
					priority
					style={{ opacity: 0.7 }}
				/>
			</div>

			{/* Navbar */}
			<header className={`fixed top-0 left-0 right-0 z-50 mx-auto flex w-full items-center justify-between px-6 py-2 transition-colors duration-300 ${scrolled ? "bg-white shadow-md" : "bg-transparent"}`}>
				<div className="max-w-7xl flex w-full items-center justify-between mx-auto">
					<Link href="/" className="flex items-center">
						<Image src="/logo.png" alt="Prebuilt UI Logo" width={120} height={40} className="h-auto w-24 sm:w-32 md:w-32 object-contain" priority />
					</Link>
					<div className="flex items-center space-x-4">
						<LanguageSwitcher />
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 pt-32 text-center sm:flex-row sm:pt-44 sm:text-left">
				{/* Left Side */}
				<div className="flex flex-1 flex-col items-center sm:items-start">
					<h1 className="text-[2.7rem] font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl">
						{tHome.rich("HeroSection.heading", {
							blue: (chunks) => <span className="text-[#1f497c]">{chunks}</span>,
							br: () => <br />,
							div: (chunks) => <span>{chunks}</span>,
						})}
					</h1>
					<p className="mt-6 max-w-lg text-lg text-gray-600">{tHome("HeroSection.subheading")}</p>

					<div className="mt-8 flex flex-wrap justify-center gap-4 sm:justify-start">
						<Link href={getLink("joinPrograms", currentLocale)} className="rounded-full bg-[#d74100] px-6 py-3  font-semibold text-white shadow-lg transition hover:bg-indigo-700">
							{tHome("HeroSection.heroCTA")}
						</Link>
						<a href="#why-us" className="rounded-full border  border-gray-300 px-6 py-3 font-medium text-white transition hover:border-indigo-500 hover:text-indigo-600">
							{tHome("HeroSection.heroSecondaryCTA")}
						</a>
					</div>
				</div>

				{/* Right Side */}
				<div className="flex-1 flex justify-center sm:justify-end px-6 sm:px-0">
					<div className="relative w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[450px] overflow-hidden rounded-[50%_50%_0_0] md:rounded-[50%_20%_50%_20%] shadow-2xl">
						<Image src="/img/gril.jpg" alt="Students collaborating" fill className="object-cover" priority />
					</div>
				</div>
			</section>
		</div>
	);
}
