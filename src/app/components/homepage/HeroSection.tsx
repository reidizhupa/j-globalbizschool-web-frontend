"use client";

import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "../LanguageSwitcher";
import { useEffect, useState } from "react";

export default function Page() {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 10);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="relative min-h-screen overflow-hidden flex items-center justify-center">
			{/* Background Image with filter */}
			<div className="absolute inset-0 -z-20">
				<Image
					src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop"
					alt="Students collaborating"
					fill
					className="object-cover"
					priority
					style={{
						filter: "brightness(0.35) contrast(1.2) blur(2px)",
					}}
				/>
			</div>

			{/* Dark Overlay for extra darkness */}
			<div className="absolute inset-0 -z-10 bg-black/50"></div>

			{/* Navbar */}
			<header className={`fixed top-0 left-0 right-0 z-50 mx-auto flex w-full items-center justify-between px-6 py-2 transition-colors duration-300 ${scrolled ? "bg-white shadow-md" : "bg-transparent"}`}>
				<div className="max-w-7xl flex w-full items-center justify-between mx-auto">
					<Link href="/" className="flex items-center">
						<Image src="/logo.png" alt="Prebuilt UI Logo" width={120} height={40} className="h-auto w-auto object-contain" priority />
					</Link>
					<div className="flex items-center space-x-4">
						<LanguageSwitcher />
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="relative z-10 flex w-full max-w-7xl flex-col items-center justify-center px-6 text-center gap-6">
				<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
					Welcome to <br />
					<span className="text-[#1f497c]">J-Global</span> Business School
				</h1>
				<p className="max-w-xl text-lg text-gray-100">Join a new generation of global leaders through mentorship, innovation, and skills that empower you to thrive in a connected world.</p>

				<div className="mt-4 flex flex-wrap justify-center gap-4">
					<Link href="#" className="rounded-full bg-[#d74100] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-700">
						Get Started
					</Link>
					<Link href="#" className="rounded-full border border-gray-300 px-6 py-3 font-medium text-gray-100 transition hover:border-indigo-500 hover:text-indigo-300">
						Learn More
					</Link>
				</div>
			</section>
		</div>
	);
}
