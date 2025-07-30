"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function Header() {
	const [isScrolled, setIsScrolled] = useState(false);
	const tHome = useTranslations("HomePage");

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 40);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="relative">
			{/* Floating background shapes */}

			{/* Full-height hero section */}
			<section
				className="relative h-screen bg-cover bg-no-repeat"
				style={{
					backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), #1f497c), url('/img/hello.png')`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				{" "}
				{/* Navbar */}
				<nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-3" : "bg-transparent py-6"}`}>
					<div className={`container mx-auto px-6 flex items-center justify-between pb-4 ${!isScrolled ? "md:border-b-2 md:border-gray-300/55" : ""}`}>
						<Link href="/" className="relative w-[180px] h-[60px] md:w-[220px] md:h-[70px]">
							<Image src="/logo.png" alt="Company Logo" fill sizes="(max-width: 768px) 180px, 220px" className="object-contain object-left" priority />
						</Link>
						<div className="flex items-center gap-4">
							<LanguageSwitcher />
						</div>
					</div>
				</nav>
				{/* Hero Content */}
				<div className="h-full flex items-center pt-32 md:pt-20">
					<div className="container mx-auto px-6">
						<div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14 max-w-6xl mx-auto">
							{/* Text Section */}
							<div className="space-y-6 text-center lg:text-left">
								<h1 data-aos="fade-up" data-aos-delay="300" data-aos-duration="1000" className="whitespace-pre-line text-4xl md:text-6xl leading-normal font-extrabold text-white" style={{ textShadow: `1px 1px 0 #777, 2px 2px 0 #999, 3px 3px 3px rgba(0,0,0,0.2),0 0 6px rgba(255, 255, 255, 0.4)` }}>
									{tHome("heroDescription")}
								</h1>

								{/* CTA Button */}
								<div className="relative inline-block mt-4">
									<Link data-aos="fade-up" data-aos-delay="500" data-aos-duration="1000" href="/free-trial" className="bg-[#f7a520] text-white md:text-2xl text-lg  font-bold rounded-full px-6 py-3 shadow-md border-[7px] border-[#fbcb65]/70 flex items-center gap-2 transition-colors duration-300 hover:bg-[#ffb648] hover:border-[#f7a520]">
										{tHome("clickFreeTrial")}
										<svg className="w-5 h-5 stroke-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
										</svg>
									</Link>
								</div>
							</div>

							{/* Image Section */}
							<div className="hidden md:flex relative justify-center lg:justify-end">
								<div data-aos="fade-left" data-aos-delay="200" data-aos-duration="1000" className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] overflow-hidden">
									<Image src="/img/bello.png" alt="Online English Conversation" fill className="object-cover object-center" priority sizes="(max-width: 768px) 500px, 700px" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<div className="relative bg-blue-50/50" style={{ transform: "scaleY(-1)" }}>
				<svg viewBox="0 0 1440 120" className="w-full text-[#1f497c]" fill="currentColor" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M0,64 C360,96 1080,32 1440,64 L1440,120 L0,120 Z" />
				</svg>
			</div>

			{/* Content Spacer */}
		</div>
	);
}
