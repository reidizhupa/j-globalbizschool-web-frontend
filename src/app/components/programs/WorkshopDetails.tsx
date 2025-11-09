"use client";

import Footer from "@/app/components/Footer";
import { useScroll } from "@/app/hoooks/useScroll";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useState } from "react";
import { FaBullseye, FaUsers, FaGlobe, FaLanguage, FaArrowRight, FaRegClock, FaChevronDown } from "react-icons/fa";
import LanguageSwitcher from "../LanguageSwitcher";
import { getProgramLink } from "@/utils/helpers";
import { getLocale } from "next-intl/server";
import { useLocale, useTranslations } from "next-intl";

export type WorkshopSession = {
	title: string;
	content: string[];
	dates: { id: string; date: string; startTime: string }[];
};

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
	code: string;
}

export default function WorkshopDetail({ workshop, code }: WorkshopDetailProps) {
	const locale = useLocale();
	const tPrograms = useTranslations("programs");
	const currentLocale = useLocale();

	// Track which accordion is open (null = none open)
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggleAccordion = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	const colors = [
		{ bg: "bg-blue-500", light: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
		{ bg: "bg-purple-500", light: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
		{ bg: "bg-orange-500", light: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
	];

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
						<a href={getProgramLink(code, locale)} className="w-full bg-[#d74100] text-white py-4 rounded-full font-semibold shadow hover:bg-[#d74100] transition flex items-center justify-center gap-2">
							{tPrograms("registerNow")} <FaArrowRight />
						</a>
					</div>
					<div className="relative">
						<Image src={workshop.image} alt={workshop.title} width={600} height={400} className="relative rounded-2xl shadow-2xl object-cover w-full h-auto border-4 border-white/20" />
					</div>
				</div>
			</section>

			{/* Two-column layout */}
			<section className="max-w-7xl mx-auto px-6 py-20">
				<div className="grid lg:grid-cols-3 gap-12">
					{/* Left Content */}
					<div className="lg:col-span-2 space-y-12">
						<div className="flex justify-center font-medium text-4xl">{tPrograms("aboutThisProgram")}</div>

						{/* Info Sections with icons */}
						<div className="max-w-6xl mx-auto">
							<div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
								{[
									{ icon: <FaBullseye />, accent: "bg-blue-500/10", iconText: "text-blue-600", dot: "bg-blue-400", title: tPrograms("programPurpose"), content: workshop.purpose },
									{ icon: <FaGlobe />, accent: "bg-teal-500/10", iconText: "text-teal-600", dot: "bg-teal-400", title: tPrograms("learningObjectives"), content: workshop.objectives },
									{ icon: <FaUsers />, accent: "bg-purple-500/10", iconText: "text-purple-600", dot: "bg-purple-400", title: tPrograms("targetParticipants"), content: workshop.participants },
									{ icon: <FaLanguage />, accent: "bg-rose-500/10", iconText: "text-rose-600", dot: "bg-rose-400", title: tPrograms("languageRequirements"), content: workshop.language },
								]
									.filter((section) => {
										let isNonEmpty = false;
										if (Array.isArray(section.content)) {
											const filteredArray = section.content
												.filter((item) => item !== undefined && item !== null)
												.map((item) => item.toString().replace(/\r/g, "").trim())
												.filter(Boolean);
											section.content = filteredArray;
											isNonEmpty = filteredArray.length > 0;
										} else if (section.content !== undefined && section.content !== null) {
											section.content = section.content.toString().replace(/\r/g, "");
											isNonEmpty = section.content.trim() !== "";
										}
										return isNonEmpty;
									})
									.map((section, idx) => (
										<div
											key={idx}
											className="
						group relative bg-white rounded-3xl 
						border border-gray-200/80
						hover:border-gray-300 hover:shadow-lg
						transition-all duration-300
						overflow-hidden
					"
										>
											<div className="p-8">
												{/* Header */}
												<div className="flex items-center gap-5 mb-7">
													<div
														className={`
								flex-shrink-0 w-12 h-12 rounded-xl
								${section.accent}
								flex items-center justify-center
								${section.iconText} text-lg
								group-hover:scale-105
								transition-all duration-300
							`}
													>
														{section.icon}
													</div>
													<div className="flex-1 min-w-0">
														<h3 className="text-lg font-semibold text-gray-900 mb-1.5">{section.title}</h3>
														<div className="h-px w-12 bg-gray-200" />
													</div>
												</div>

												{/* Content */}
												<div className="space-y-3.5">
													{Array.isArray(section.content)
														? section.content.map((item, i) => (
																<div key={i} className="flex items-start gap-3 group/item">
																	<div
																		className={`
												flex-shrink-0 w-1.5 h-1.5 rounded-full ${section.dot}
												mt-2 opacity-60 group-hover/item:opacity-100
												transition-opacity duration-200
											`}
																	/>
																	<span className="text-gray-700 text-[15px] leading-relaxed font-light flex-1">{String(item).replace(/\r/g, "")}</span>
																</div>
														  ))
														: section.content
																?.split(/(?=●|・|●|\d+\.)/)
																.filter(Boolean)
																.map((line, i) => {
																	const trimmed = line.trim().replace(/\r/g, "");
																	const hasNumber = /^\d+\./.test(trimmed);
																	const text = trimmed.replace(/^(●|●|\d+\.\s*)/, "").trim();

																	return (
																		<div key={i} className="flex items-start gap-3 group/item">
																			{hasNumber ? (
																				<span
																					className={`
															flex-shrink-0 text-xs font-medium ${section.iconText}
															mt-0.5 min-w-[1.25rem] opacity-60 group-hover/item:opacity-100
															transition-opacity duration-200
														`}
																				>
																					{trimmed.match(/^\d+/)?.[0]}.
																				</span>
																			) : (
																				<div
																					className={`
															flex-shrink-0 w-1.5 h-1.5 rounded-full ${section.dot}
															mt-2 opacity-60 group-hover/item:opacity-100
															transition-opacity duration-200
														`}
																				/>
																			)}
																			<span className="text-gray-700 text-[15px] leading-relaxed font-light flex-1">{text}</span>
																		</div>
																	);
																})}
												</div>
											</div>
										</div>
									))}
							</div>
						</div>

						{/* Mobile Sidebar - shown only on mobile between sections */}
						<aside className="lg:hidden">
							<div className="space-y-6 bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-md">
								<h2 className="text-2xl font-medium text-gray-900 mb-5">{tPrograms("registerToWorkshops")}</h2>
								<a href={getProgramLink(code, locale)} className="w-full bg-[#d74100] text-white py-4 rounded-full font-semibold shadow flex items-center justify-center gap-2">
									{tPrograms("registerNow")} <FaArrowRight />
								</a>

								<hr className="border-t border-gray-200 my-4" />
								<div className="mt-10 font-semibold text-gray-700">{tPrograms("availableWorkshops")}</div>

								<div className="space-y-4 mt-4">
									{workshop.sessions.map((session, i) => {
										return (
											<a key={i} href={`#workshop-accordion-${i}`} className="group flex items-center justify-between py-2 border-b border-gray-100 hover:bg-gray-50/70 transition-colors duration-150">
												<p className="text-sm text-gray-700 font-medium group-hover:text-blue-600 transition-colors">{session.title}</p>
												<span className="text-gray-400 text-xs group-hover:text-blue-500 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
											</a>
										);
									})}
								</div>
							</div>
						</aside>

						<div className="flex justify-center font-medium mt-20 text-4xl">{tPrograms("availableWorkshops")}</div>

						{/* Sessions */}
						{workshop.sessions.map((session, i) => {
							const accentColors = ["from-slate-600 to-slate-700", "from-stone-600 to-stone-700", "from-neutral-600 to-neutral-700", "from-gray-600 to-gray-700"];

							const color = colors[i % colors.length];
							const isOpen = openIndex === i;

							return (
								<div
									id={`workshop-accordion-${i}`}
									key={i}
									className={`
				group rounded-3xl overflow-hidden 
				bg-gradient-to-br from-white to-gray-50/30
				border transition-all duration-300 ease-out
				${isOpen ? "shadow-2xl border-gray-300 ring-1 ring-gray-900/5" : "shadow-md border-gray-200/60 hover:shadow-xl hover:border-gray-300/80"}
			`}
								>
									{/* Accordion Header - Elegant Workshop Card */}
									<button onClick={() => toggleAccordion(i)} aria-expanded={isOpen} aria-controls={`workshop-content-${i}`} className="w-full text-left">
										<div className="p-8 sm:p-10">
											<div className="flex items-start justify-between gap-6">
												<div className="flex-1 min-w-0">
													{/* Elegant header with accent line */}
													<div className="flex items-center gap-4 mb-4">
														<div
															className={`
									h-12 w-1 rounded-full bg-gradient-to-b ${accentColors[i % 4]}
									transition-all duration-300
									${isOpen ? "h-16" : "group-hover:h-14"}
								`}
														/>
														<div>
															<span className="block text-xs font-semibold text-gray-400 uppercase tracking-[0.2em] mb-1">
																{tPrograms("workshop")} {String(i + 1).padStart(2, "0")}
															</span>
															<div className="h-px w-12 bg-gradient-to-r from-gray-300 to-transparent" />
														</div>
													</div>

													{/* Title */}
													<h3
														className={`
								 text-3xl font-light text-gray-900 mb-5 
								leading-tight tracking-tight
								transition-colors duration-300
								${isOpen ? "text-gray-900" : "group-hover:text-gray-700"}
							`}
													>
														{session.title}
													</h3>
												</div>

												{/* Minimalist expand indicator */}
												<div className="flex flex-col items-center gap-2 pt-2">
													<div
														className={`
								w-12 h-12 rounded-full 
								border-2 transition-all duration-300 ease-out
								flex items-center justify-center
								${isOpen ? "border-gray-900 bg-gray-900 scale-110" : "border-gray-300 bg-white group-hover:border-gray-400 group-hover:scale-105"}
							`}
													>
														<FaChevronDown
															className={`
										w-3.5 h-3.5 transition-all duration-300
										${isOpen ? "rotate-180 text-white" : "text-gray-500 group-hover:text-gray-700"}
									`}
															aria-hidden="true"
														/>
													</div>
													{isOpen && <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{tPrograms("close")}</span>}
												</div>
											</div>
										</div>
									</button>
									{/* Accordion Content */}
									<div
										id={`workshop-content-${i}`}
										className={`
		transition-all duration-500 ease-in-out 
		${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"} 
		overflow-hidden
	`}
									>
										<div className="px-8 sm:px-10 pb-10 bg-gradient-to-b from-gray-50/50 to-white">
											{/* Divider */}
											<div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8" />

											{/* What You'll Learn */}
											<div className="mb-8">
												<h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{tPrograms("whatYouWillLearn")}</h4>
												<div className="space-y-3">
													{session.content
														?.flatMap((item) =>
															item
																// Split at bullets or numbers with one or more digits followed by dot+space
																.split(/(?=●|・|\b\d+\.\s)/)
																.map((line) => line.trim())
																.filter(Boolean)
														)
														.map((line, j) => {
															const isBullet = /^(●|・)/.test(line);
															const isNumbered = /^\d+\./.test(line);

															// Remove bullet only; keep numbers intact
															const text = isBullet ? line.replace(/^(●|・)/, "").trim() : line;

															return (
																<div key={j} className="flex items-start gap-3">
																	{/* Show custom dot only for bullets */}
																	<div className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 ${isBullet ? "bg-gray-400" : "bg-transparent"}`} />
																	<span className="text-base text-gray-700 leading-relaxed">{text}</span>
																</div>
															);
														})}
												</div>
											</div>

											{/* Available Times */}
											<div className="mb-10">
												<div className="flex items-center gap-3 mb-6">
													<div className="h-8 w-1 rounded-full bg-gradient-to-b from-gray-600 to-gray-700" />
													<h4 className="text-xs font-semibold text-gray-400 uppercase tracking-[0.2em]">{tPrograms("availableDates")}</h4>
													<span className="text-xs font-light text-gray-400 ml-1">
														({session.dates.length} {session.dates.length === 1 ? tPrograms("date") : tPrograms("dates")})
													</span>
												</div>
												<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
													{session.dates.map((date, j) => {
														const parsedDate = new Date(`${date.date} ${date.startTime}`);
														const monthNames = [tPrograms("jan"), tPrograms("feb"), tPrograms("mar"), tPrograms("apr"), tPrograms("may"), tPrograms("jun"), tPrograms("jul"), tPrograms("aug"), tPrograms("sep"), tPrograms("oct"), tPrograms("nov"), tPrograms("dec")];
														const month = monthNames[parsedDate.getMonth()];
														const day = currentLocale === "jp" ? `${parsedDate.getDate()}日` : parsedDate.getDate();
														let hours = parsedDate.getHours();
														const minutes = parsedDate.getMinutes().toString().padStart(2, "0");
														const ampm = currentLocale === "en" ? (hours >= 12 ? "PM" : "AM") : "";
														hours = hours % 12 || 12;

														const handleClick = async () => {
															try {
																const res = await fetch(`/api/fmp/records/events/${date.id}`, { method: "GET" });
																const data = await res.json();
																if (!res.ok) {
																	alert(`Error: ${data.error || "Failed to fetch workshop"}`);
																	return;
																}
																console.log("Workshop data:", data);
															} catch (err) {
																console.error("Failed to fetch:", err);
																alert("Failed to load workshop data");
															}
														};

														return (
															<button
																key={j}
																onClick={handleClick}
																className="
								group relative px-4 py-3.5 rounded-xl
								bg-white border border-gray-200
								hover:border-gray-300 hover:shadow-md
								active:scale-[0.98]
								transition-all duration-200
								text-left
							"
															>
																<div className="flex items-center gap-3">
																	<div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:border-gray-200 transition-colors">
																		<FaRegClock className="w-4 h-4 text-gray-400" />
																	</div>
																	<div className="flex-1 min-w-0">
																		<div className="text-sm font-medium text-gray-900">
																			{month} {day}
																		</div>
																		<div className="text-xs font-light text-gray-500">
																			{hours}:{minutes} {ampm}
																		</div>
																	</div>
																</div>
															</button>
														);
													})}
												</div>
											</div>

											{/* Divider */}
											<div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8" />

											{/* Join Button */}
											<button
												className="
			group relative w-full 
			bg-gradient-to-r from-gray-800 to-gray-900 
			text-white font-medium py-4 rounded-xl 
			hover:from-gray-900 hover:to-black
			active:scale-[0.99]
			transition-all duration-200 
			shadow-lg hover:shadow-xl
			overflow-hidden
		"
											>
												<span className="relative z-10 flex items-center justify-center gap-2">
													<span>{tPrograms("registerToWorkshop")}</span>
													<svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
													</svg>
												</span>
												<div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
											</button>
										</div>
									</div>
								</div>
							);
						})}
					</div>

					{/* Desktop Sidebar - hidden on mobile */}
					<aside className="hidden lg:block lg:col-span-1 sticky top-30 self-start">
						<div className="space-y-6 bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-md overflow-y-auto max-h-[calc(100vh-8rem)]">
							<h2 className="text-2xl font-medium text-gray-900 mb-5">{tPrograms("registerToWorkshops")}</h2>
							<a href={getProgramLink(code, locale)} className="w-full bg-[#d74100] text-white py-4 rounded-full font-semibold shadow flex items-center justify-center gap-2">
								{tPrograms("registerNow")} <FaArrowRight />
							</a>

							<hr className="border-t border-gray-200 my-4" />
							<div className="mt-10 font-semibold text-gray-700">{tPrograms("availableWorkshops")}</div>

							<div className="space-y-4 mt-4">
								{workshop.sessions.map((session, i) => {
									return (
										<a key={i} href={`#workshop-accordion-${i}`} className="group flex items-center justify-between py-2 border-b border-gray-100 hover:bg-gray-50/70 transition-colors duration-150">
											<p className="text-sm text-gray-700 font-medium group-hover:text-blue-600 transition-colors">{session.title}</p>
											<span className="text-gray-400 text-xs group-hover:text-blue-500 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
										</a>
									);
								})}
							</div>
						</div>
					</aside>
				</div>
			</section>

			<Footer />
		</main>
	);
}
