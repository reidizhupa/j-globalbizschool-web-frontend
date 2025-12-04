import Footer from "@/app/components/Footer";
import { FaBullseye, FaUsers, FaGlobe, FaLanguage, FaArrowRight } from "react-icons/fa";
import { getProgramLink } from "@/utils/helpers";
import { useLocale, useTranslations } from "next-intl";

import WorkshopDetailHeader from "./WorkshopDetailHeader";
import WorkshopHero from "./WorkshopHero";
import WorkshopSessions from "./WorkshopSessions";

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
	const tLevels = useTranslations("levels");

	return (
		<main className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50/30">
			<WorkshopDetailHeader />

			<WorkshopHero title={workshop.title} subtitle={workshop.subtitle} image={workshop.image} code={code} levelLabel={tLevels(code)} registerNowLabel={tPrograms("registerNow")} readMoreLabel={tPrograms("readMore")} readLessLabel={tPrograms("readLess")} locale={locale} />

			<section className="max-w-7xl mx-auto px-6 py-20">
				<div className="grid lg:grid-cols-3 gap-12">
					<div className="lg:col-span-2 space-y-12">
						<div className="flex justify-center font-medium text-4xl">{tPrograms("aboutThisProgram")}</div>

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
												<div className="flex items-center gap-5 mb-7">
													<div
														className={`
															shrink-0 w-12 h-12 rounded-xl
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

												<div className="space-y-3.5">
													{Array.isArray(section.content)
														? section.content.map((item, i) => (
																<div key={i} className="flex items-start gap-3 group/item">
																	<div
																		className={`
																			shrink-0 w-1.5 h-1.5 rounded-full ${section.dot}
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
																	const text = trimmed.replace(/^(●|●|・|\d+\.\s*)/, "").trim();

																	return (
																		<div key={i} className="flex items-start gap-3 group/item">
																			{hasNumber ? (
																				<span
																					className={`
																						shrink-0 text-xs font-medium ${section.iconText}
																						mt-0.5 min-w-5 opacity-60 group-hover/item:opacity-100
																						transition-opacity duration-200
																					`}
																				>
																					{trimmed.match(/^\d+/)?.[0]}.
																				</span>
																			) : (
																				<div
																					className={`
																						shrink-0 w-1.5 h-1.5 rounded-full ${section.dot}
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

						<WorkshopSessions
							sessions={workshop.sessions}
							locale={locale}
							translations={{
								workshop: tPrograms("workshop"),
								close: tPrograms("close"),
								whatYouWillLearn: tPrograms("whatYouWillLearn"),
								availableDates: tPrograms("availableDates"),
								date: tPrograms("date"),
								dates: tPrograms("dates"),
								registerToWorkshop: tPrograms("registerToWorkshop"),
								jan: tPrograms("jan"),
								feb: tPrograms("feb"),
								mar: tPrograms("mar"),
								apr: tPrograms("apr"),
								may: tPrograms("may"),
								jun: tPrograms("jun"),
								jul: tPrograms("jul"),
								aug: tPrograms("aug"),
								sep: tPrograms("sep"),
								oct: tPrograms("oct"),
								nov: tPrograms("nov"),
								dec: tPrograms("dec"),
							}}
						/>
					</div>

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
