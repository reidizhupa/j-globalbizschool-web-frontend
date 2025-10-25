"use client";

import Footer from "@/app/components/Footer";
import { useScroll } from "@/app/hoooks/useScroll";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useState } from "react";
import { FaBullseye, FaUsers, FaGlobe, FaLanguage, FaArrowRight, FaRegClock } from "react-icons/fa";
import LanguageSwitcher from "../LanguageSwitcher";

export interface WorkshopSession {
	title: string;
	content: string[];
	dates: string[];
}

export interface Workshop {
	title: string;
	subtitle: string;
	image: string;
	purpose: string[];
	participants: string;
	objectives: string[];
	language: string;
	sessions: WorkshopSession[];
}

interface WorkshopDetailProps {
	workshop: Workshop;
}

export default function WorkshopDetail({ workshop }: WorkshopDetailProps) {
	const [showAllSessions, setShowAllSessions] = useState<boolean[]>(workshop.sessions.map(() => false));

	const toggleShowAll = (index: number) => {
		setShowAllSessions((prev) => {
			const newState = [...prev];
			newState[index] = !newState[index];
			return newState;
		});
	};
	const scrolled = useScroll(10);

	return (
		<main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
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
			<section className="relative text-white overflow-hidden">
				<div
					className="absolute inset-0"
					style={{
						backgroundImage: "url('/img/sun-tornado.svg')",
						backgroundSize: "cover",
						backgroundRepeat: "no-repeat",
						opacity: 0.6,
					}}
				/>
				<div className="absolute inset-0 bg-black/20"></div>

				<div className="relative max-w-6xl mx-auto px-6 py-20 mt-10 grid lg:grid-cols-2 gap-12 items-center">
					<div className="space-y-6">
						<h1 className="text-5xl lg:text-6xl font-bold leading-tight">{workshop.title}</h1>
						<p className="text-lg text-blue-100 leading-relaxed">{workshop.subtitle}</p>
						<button className="w-full bg-[#d74100] text-white py-4 rounded-full font-semibold shadow hover:bg-[#d74100] transition flex items-center justify-center gap-2">
							Register Now <FaArrowRight />
						</button>
					</div>
					<div className="relative">
						<Image src={workshop.image} alt={workshop.title} width={600} height={400} className="relative rounded-2xl shadow-2xl object-cover w-full h-auto border-4 border-white/20" />
					</div>
				</div>
			</section>

			{/* Two-column layout */}
			<section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-3 gap-12">
				{/* Left Content */}
				<div className="lg:col-span-2 space-y-12">
					{/* Info Sections with icons */}
					<div className="space-y-6">
						{[
							{ icon: <FaBullseye />, color: "bg-blue-100 text-blue-600", title: "Program Purpose", content: workshop.purpose },
							{ icon: <FaGlobe />, color: "bg-green-100 text-green-600", title: "Learning Objectives", content: workshop.objectives },
							{ icon: <FaUsers />, color: "bg-orange-100 text-orange-500", title: "Target Participants", content: workshop.participants },
							{ icon: <FaLanguage />, color: "bg-purple-100 text-purple-600", title: "Language Requirement", content: workshop.language },
						]
							.filter((section) => {
								let isNonEmpty = false;

								if (Array.isArray(section.content)) {
									// Remove undefined, null, empty strings, and trim whitespace
									const filteredArray = section.content
										.filter((item) => item !== undefined && item !== null)
										.map((item) => item.toString().trim())
										.filter(Boolean);

									section.content = filteredArray; // update content
									isNonEmpty = filteredArray.length > 0;
								} else if (section.content !== undefined && section.content !== null) {
									isNonEmpty = section.content.toString().trim() !== "";
								}

								return isNonEmpty;
							})

							.map((section, idx) => (
								<div key={idx} className="flex items-start gap-4 pb-6 border-b border-gray-200 last:border-none rounded-lg p-2">
									<div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${section.color}`}>{section.icon}</div>
									<div className="flex-1">
										<h3 className="text-2xl font-semibold text-gray-900 mb-6">{section.title}</h3>
										<div className="flex flex-col gap-2">
											{Array.isArray(section.content)
												? section.content.map((item, i) => (
														<span key={i} className="inline-flex items-center gap-1 px-3 text-gray-800 rounded-full">
															<div className="w-2 h-2 mr-2 bg-blue-500 rounded-full"></div>
															{item}
														</span>
												  ))
												: section.content
														?.split("●")
														.filter(Boolean)
														.map((line, i) => (
															<span key={i} className="inline-flex items-center gap-1 px-3 text-gray-800 rounded-full">
																<div className="w-2 h-2 mr-2 bg-blue-500 rounded-full"></div>
																{line.trim()}
															</span>
														))}
										</div>
									</div>
								</div>
							))}
					</div>

					<div className="flex justify-center font-bold text-3xl">Available Workshops</div>

					{/* Sessions */}
					<div className="space-y-16">
						{workshop.sessions.map((session, i) => (
							<div key={i} className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-md p-6">
								<div className="flex items-center gap-4 mb-4">
									<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md">{i + 1}</div>
									<h3 className="text-2xl font-bold text-gray-900">{session.title}</h3>
								</div>

								<div className="relative pl-6">
									{/* Vertical gradient line */}
									<div className="absolute left-1 top-0 bottom-0 w-px bg-gradient-to-b from-blue-300 via-blue-200 to-transparent"></div>

									<ul className="space-y-5">
										{session.content.map((item, j) => (
											<li key={j} className="relative flex items-center gap-3">
												{/* Dot */}
												<span className="absolute -left-[6px] mt-1 w-2 h-2 bg-blue-500 rounded-full ring-4 ring-white group-hover:ring-blue-200 transition-all"></span>

												{/* Content box */}
												<div className="rounded-2xl px-4 py-1 bg-white text-gray-800 transition ">{item}</div>
											</li>
										))}
									</ul>
								</div>

								<hr className="my-6 border-t border-gray-200" />

								<div className="rounded-xl p-4">
									<div className="flex items-center gap-2 mb-2">
										<h4 className="text-lg font-semibold text-green-800">Available Sessions</h4>
									</div>
									<div className="flex flex-wrap gap-2">
										{session.dates.map((date, j) => (
											<span key={j} className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-800 text-xs font-medium rounded-full border border-green-200">
												<FaRegClock className="w-3 h-3" />
												{date}
											</span>
										))}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Sidebar */}
				<aside className="lg:col-span-1 sticky top-30 self-start flex flex-col justify-between h-[calc(100vh-5rem)]">
					<div className="space-y-6 bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-md overflow-y-auto max-h-[80vh]">
						<h2 className="text-2xl font-bold text-gray-900 mb-2">Register to workshops</h2>
						<button className="w-full bg-[#d74100] text-white py-4 rounded-full font-semibold shadow flex items-center justify-center gap-2">
							Register Now <FaArrowRight />
						</button>

						<hr className="border-t border-gray-200 my-4" />
						<div className="mt-10 font-semibold text-gray-700">Available workshops</div>

						<div className="space-y-4 mt-4">
							{workshop.sessions.map((session, i) => {
								const showDates = showAllSessions[i];
								return (
									<div key={i} className="border-b border-gray-200 last:border-none pb-3">
										<p className="text-gray-500">{session.title}</p>
										<button onClick={() => toggleShowAll(i)} className="mb-2 text-blue-600 text-sm font-medium hover:underline">
											{showDates ? "Hide Dates" : `Show Dates (${session.dates.length})`}
										</button>

										{showDates && (
											<div className="flex flex-wrap gap-2">
												{session.dates.map((date, j) => (
													<span key={j} className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
														<FaRegClock className="w-3 h-3" />
														{date}
													</span>
												))}
											</div>
										)}
									</div>
								);
							})}
						</div>
					</div>
				</aside>
			</section>

			<Footer />
		</main>
	);
}
