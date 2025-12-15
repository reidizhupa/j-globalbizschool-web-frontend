"use client";

import { useState } from "react";
import { FaChevronDown, FaRegClock } from "react-icons/fa";

export type WorkshopSession = {
	title: string;
	content: string[];
	dates: { id: string; date: string; startTime: string }[];
};

interface WorkshopSessionsProps {
	sessions: WorkshopSession[];
	locale: string;
	translations: {
		workshop: string;
		close: string;
		whatYouWillLearn: string;
		availableDates: string;
		date: string;
		dates: string;
		registerToWorkshop: string;
		jan: string;
		feb: string;
		mar: string;
		apr: string;
		may: string;
		jun: string;
		jul: string;
		aug: string;
		sep: string;
		oct: string;
		nov: string;
		dec: string;
	};
}

export default function WorkshopSessions({ sessions, locale, translations }: WorkshopSessionsProps) {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggleAccordion = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	const accentColors = ["from-slate-600 to-slate-700", "from-stone-600 to-stone-700", "from-neutral-600 to-neutral-700", "from-gray-600 to-gray-700"];

	return (
		<>
			{sessions.map((session, i) => {
				const isOpen = openIndex === i;

				return (
					<div
						id={`workshop-accordion-${i}`}
						key={i}
						className={`
							group rounded-3xl overflow-hidden 
							bg-linear-to-brrom-white to-gray-50/30
							border transition-all duration-300 ease-out
							${isOpen ? "shadow-2xl border-gray-300 ring-1 ring-gray-900/5" : "shadow-md border-gray-200/60 hover:shadow-xl hover:border-gray-300/80"}
						`}
					>
						<button onClick={() => toggleAccordion(i)} aria-expanded={isOpen} aria-controls={`workshop-content-${i}`} className="w-full text-left">
							<div className="p-8 sm:p-10">
								<div className="flex items-start justify-between gap-6">
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-4 mb-4">
											<div
												className={`
													h-12 w-1 rounded-full bg-linear-to-b ${accentColors[i % 4]}
													transition-all duration-300
													${isOpen ? "h-16" : "group-hover:h-14"}
												`}
											/>
											<div>
												<span className="block text-xs font-semibold text-gray-400 uppercase tracking-[0.2em] mb-1">
													{translations.workshop} {String(i + 1).padStart(2, "0")}
												</span>
												<div className="h-px w-12 bg-linear-to-r from-gray-300 to-transparent" />
											</div>
										</div>

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
										{isOpen && <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{translations.close}</span>}
									</div>
								</div>
							</div>
						</button>

						<div
							id={`workshop-content-${i}`}
							className={`
								transition-all duration-500 ease-in-out 
								${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"} 
								overflow-hidden
							`}
						>
							<div className="px-8 sm:px-10 pb-10 bg-linear-to-b from-gray-50/50 to-white">
								<div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mb-8" />

								<div className="mb-8">
									<h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{translations.whatYouWillLearn}</h4>
									<div className="space-y-3">
										{session.content
											?.flatMap((item) =>
												item
													.split(/(?=●|・|\b\d+\.\s)/)
													.map((line) => line.trim())
													.filter(Boolean)
											)
											.map((line, j) => {
												const isBullet = /^(●|・)/.test(line);
												const text = isBullet ? line.replace(/^(●|・)/, "").trim() : line;

												return (
													<div key={j} className="flex items-start gap-3">
														<div className={`shrink-0 w-1.5 h-1.5 rounded-full mt-2 ${isBullet ? "bg-gray-400" : "bg-transparent"}`} />
														<span className="text-base text-gray-700 leading-relaxed">{text}</span>
													</div>
												);
											})}
									</div>
								</div>

								<div className="mb-10">
									<div className="flex items-center gap-3 mb-6">
										<div className="h-8 w-1 rounded-full bg-linear-to-b from-gray-600 to-gray-700" />
										<h4 className="text-xs font-semibold text-gray-400 uppercase tracking-[0.2em]">{translations.availableDates}</h4>
										<span className="text-xs font-light text-gray-400 ml-1">
											({session.dates.length} {session.dates.length === 1 ? translations.date : translations.dates})
										</span>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
										{session.dates.map((date, j) => {
											const parsedDate = new Date(`${date.date} ${date.startTime}`);
											const monthNames = [translations.jan, translations.feb, translations.mar, translations.apr, translations.may, translations.jun, translations.jul, translations.aug, translations.sep, translations.oct, translations.nov, translations.dec];
											const month = monthNames[parsedDate.getMonth()];
											const day = locale === "ja" ? `${parsedDate.getDate()}日` : parsedDate.getDate();
											let hours = parsedDate.getHours();
											const minutes = parsedDate.getMinutes().toString().padStart(2, "0");
											const ampm = locale === "en" ? (hours >= 12 ? "PM" : "AM") : "";
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
														<div className="shrink-0 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:border-gray-200 transition-colors">
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

								<div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mb-8" />

								<button
									className="
										group relative w-full 
										bg-linear-to-r from-gray-800 to-gray-900 
										text-white font-medium py-4 rounded-xl 
										hover:from-gray-900 hover:to-black
										active:scale-[0.99]
										transition-all duration-200 
										shadow-lg hover:shadow-xl
										overflow-hidden
									"
								>
									<span className="relative z-10 flex items-center justify-center gap-2">
										<span>{translations.registerToWorkshop}</span>
										<svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
										</svg>
									</span>
									<div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
								</button>
							</div>
						</div>
					</div>
				);
			})}
		</>
	);
}
