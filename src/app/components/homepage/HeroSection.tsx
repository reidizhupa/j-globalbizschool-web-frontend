"use client";

import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "../LanguageSwitcher";
import { useEffect, useState } from "react";

export default function Page() {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10); // change 10 to any offset you like
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	return (
		<div className="relative min-h-screen overflow-hidden">
			{/* Background Image */}
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
						<Image src="/logo.png" alt="Prebuilt UI Logo" width={120} height={40} className="h-auto w-auto object-contain" priority />
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
					<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
						Welcome to <br />
						<span className="text-[#1f497c] ">J-Global</span> Business School
					</h1>
					<p className="mt-6 max-w-lg text-lg text-gray-600">Join a new generation of global leaders through mentorship, innovation, and skills that empower you to thrive in a connected world.</p>

					<div className="mt-8 flex flex-wrap justify-center gap-4 sm:justify-start">
						<Link href="#" className="rounded-full bg-[#d74100] px-6 py-3  font-semibold text-white shadow-lg transition hover:bg-indigo-700">
							Get Started
						</Link>
						<Link href="#" className="rounded-full border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:border-indigo-500 hover:text-indigo-600">
							Learn More
						</Link>
					</div>
				</div>

				{/* Right Side */}
				<div className="flex-1 flex justify-center sm:justify-end px-6 sm:px-0 mb-10 sm:mb-0">
					<div className="relative w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[450px] overflow-hidden rounded-[50%_20%_50%_20%] shadow-2xl">
						<Image src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop" alt="Students collaborating" fill className="object-cover" priority />
					</div>
				</div>
			</section>
		</div>
	);
}
