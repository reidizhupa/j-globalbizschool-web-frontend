// components/FreeTrialSection.tsx
"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import React from "react";
import { getLink } from "@/lib/links";

const FreeTrialSection = () => {
	const t = useTranslations("homepage"); // namespace
	const currentLocale = useLocale();

	return (
		<div className="mt-0 mb-20 overflow-hidden">
			<div className="relative w-full py-10 px-4">
				{/* Background Image with opacity */}
				<div className="absolute inset-0 -z-10">
					<div className="w-full h-full bg-[#3a70c6de] absolute inset-0 z-10" />
					<img src="/img/prova3.png" alt={t("FreeTrialSection.backgroundAlt")} className="w-full h-full object-cover opacity-20" />
				</div>

				<div className="max-w-2xl mx-auto relative z-20">
					<h1 className="text-white text-4xl font-bold text-center mb-8">{t("FreeTrialSection.title")}</h1>

					<div className="block md:flex justify-center gap-6 mb-10">
						<div className="flex items-center justify-center text-white text-lg mb-3 md:mb-0">
							<span className="inline-flex items-center justify-center w-6 h-6 bg-white/20 rounded-full mr-3">✓</span>
							{t("FreeTrialSection.feature1")}
						</div>
					</div>

					<div className="text-center">
						<Link href={getLink("joinPrograms", currentLocale)} className="inline-block text-2xl text-white bg-[#d74100] font-bold py-4 px-13 rounded-full hover:bg-[#f7a520]/90 transition-colors">
							{t("FreeTrialSection.cta")}
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FreeTrialSection;
