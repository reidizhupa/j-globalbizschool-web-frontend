import HeroSection from "@/app/components/homepage/HeroSection";
import JGlobalBusinessSchool from "@/app/components/homepage/WhyUs";
import JGlobalAchievements from "@/app/components/homepage/Achievements";
import FreeTrial from "@/app/components/homepage/FreeTrial";
import CardGridSection, { CardGridData } from "@/app/components/homepage/CardGridSection";
import { BookOpen, Briefcase } from "lucide-react";
import LecturerIntroduction from "@/app/components/homepage/LecturerIntroduction";
import Instructors from "@/app/components/homepage/Instructors";

import type { Metadata, ResolvingMetadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import LogoSection from "../components/homepage/LogoSection";
import { useTranslations } from "next-intl";
import FeturedIn from "../components/homepage/FeaturedIn";
import Footer from "../components/Footer";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
	return generatePageMetadata(props, parent, "seo");
}

export default function HomePage() {
	const tLevels = useTranslations("levels");

	// === DEBUG: Check environment variable ===
	const hasVar = !!process.env.GOOGLE_SERVICE_ACCOUNT;
	const length = process.env.GOOGLE_SERVICE_ACCOUNT?.length || 0;
	const allGoogleKeys = Object.keys(process.env).filter((k) => k.includes("GOOGLE"));
	const firstChars = process.env.GOOGLE_SERVICE_ACCOUNT?.substring(0, 100);

	console.log("=== HOMEPAGE ENV DEBUG ===");
	console.log("Has GOOGLE_SERVICE_ACCOUNT:", hasVar);
	console.log("Length:", length);
	console.log("All GOOGLE keys:", allGoogleKeys);
	console.log("First 100 chars:", firstChars);
	console.log("========================");
	// === END DEBUG ===

	const globalPrograms: CardGridData = {
		level: tLevels("level1"),
		title: tLevels("globalCommunication"),
		description: tLevels("globalCommunicationDescription"),
		stats: [
			{ icon: <BookOpen className="w-4 h-4" />, label: tLevels("programsCount", { count: 24 }) },
			{ icon: <Briefcase className="w-4 h-4" />, label: tLevels("workshopsCount", { count: 70 }) },
		],
		cards: [
			{
				id: "CO1",
				title: tLevels("interculturalSkills"),
				image: "/img/globals/intercultural-skills-C01.jpg",
				link: "/courses/co1",
			},
			{
				id: "CO2",
				title: tLevels("globalMindset"),
				image: "/img/globals/global-mindset-C02.png",
				link: "/courses/co2",
			},
			{
				id: "CO3",
				title: tLevels("growthMindset"),
				image: "/img/globals/growth-mindset-C03.webp",
				link: "/courses/co3",
			},
			{
				id: "CO4",
				title: tLevels("presentation"),
				image: "/img/globals/presentation-C04.jpg",
				link: "/courses/co4",
			},
			{
				id: "BIZNITE",
				title: tLevels("countryBizNites"),
				image: "/img/globals/country-biz-nites.jpg",
				link: "/events/biz-nite",
			},
		],
	};

	const globalTeamwork: CardGridData = {
		level: tLevels("level2"),
		title: tLevels("globalTeamwork"),
		description: tLevels("globalTeamworkDescription"),
		stats: [
			{ icon: <BookOpen className="w-4 h-4" />, label: tLevels("programsCount", { count: 23 }) },
			{ icon: <Briefcase className="w-4 h-4" />, label: tLevels("workshopsCount", { count: 65 }) },
		],
		cards: [
			{
				id: "L12",
				title: tLevels("teamBuilding"),
				image: "/img/globals/L12.webp",
				link: "/programs/global-teamwork/l12-team-building",
			},
			{
				id: "CO6",
				title: tLevels("negotiation"),
				image: "/img/globals/C06.jpg",
				link: "/programs/global-teamwork/C06-negotiation",
			},
			{
				id: "F01",
				title: tLevels("globalSales"),
				image: "/img/globals/F01.avif",
				link: "/programs/global-teamwork/F01-global-sales",
			},
			{
				id: "F08",
				title: tLevels("globalProjects"),
				image: "/img/globals/F08.jpg",
				link: "/programs/global-teamwork/F08-global-projects",
			},
			{
				id: "C09",
				title: tLevels("businessGame"),
				image: "/img/globals/C09.png",
				link: "/programs/global-teamwork/c09-business-game",
			},
		],
	};

	const globalLeadership: CardGridData = {
		level: tLevels("level3"),
		title: tLevels("globalLeadership"),
		description: tLevels("globalLeadershipDescription"),
		stats: [
			{ icon: <BookOpen className="w-4 h-4" />, label: tLevels("programsCount", { count: 14 }) },
			{ icon: <Briefcase className="w-4 h-4" />, label: tLevels("workshopsCount", { count: 40 }) },
		],
		cards: [
			{
				id: "L01",
				title: tLevels("coaching"),
				image: "/img/globals/L01.png",
				link: "/courses/co1",
			},
			{
				id: "L08",
				title: tLevels("strategy"),
				image: "/img/globals/L08.jpg",
				link: "/courses/co2",
			},
			{
				id: "I01",
				title: tLevels("miniInternship"),
				image: "/img/globals/C06.jpg",
				link: "/courses/co3",
			},
			{
				id: "L02",
				title: tLevels("practicalThinking"),
				image: "/img/globals/L02.avif",
				link: "/courses/co4",
			},
			{
				id: "L03",
				title: tLevels("miniMBA"),
				image: "/img/globals/C09.png",
				link: "/events/biz-nite",
			},
		],
	};

	return (
		<>
			{/* === DEBUG OUTPUT - REMOVE AFTER TESTING === */}
			<div
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					background: hasVar ? "#d4edda" : "#f8d7da",
					color: hasVar ? "#155724" : "#721c24",
					padding: "20px",
					zIndex: 9999,
					borderBottom: "3px solid " + (hasVar ? "#28a745" : "#dc3545"),
					fontFamily: "monospace",
					fontSize: "12px",
				}}
			>
				<strong style={{ fontSize: "16px" }}>{hasVar ? "✅ GOOGLE_SERVICE_ACCOUNT IS SET" : "❌ GOOGLE_SERVICE_ACCOUNT NOT SET"}</strong>
				<div>Length: {length} characters</div>
				<div>Keys found: {allGoogleKeys.join(", ") || "None"}</div>
				<div>First 100 chars: {firstChars || "N/A"}</div>
			</div>
			<div style={{ marginTop: "150px" }}>
				{/* === END DEBUG === */}

				<HeroSection />
				<JGlobalBusinessSchool />
				<JGlobalAchievements />
				<LogoSection />

				<FreeTrial />
				<div className="bg-[#dbe9ff] pt-20">
					<div className="bg-[url('/img/bg_continuation.png')] bg-cover bg-center bg-no-repeat">
						<h1 className="text-4xl md:text-5xl flex justify-center lg:text-5xl font-extrabold tracking-tight text-gray-600 mb-10">
							<span className="bg-clip-text  relative z-10"> Unlimited opportunites</span>
						</h1>
						{/* Content */}
						<div data-aos="fade-right" data-aos-duration="600">
							<CardGridSection {...globalPrograms} align="left" />
						</div>

						<div data-aos="fade-left" data-aos-duration="600">
							<CardGridSection {...globalTeamwork} align="right" />
						</div>
						<div data-aos="fade-right" data-aos-duration="600">
							<CardGridSection {...globalLeadership} align="left" />
						</div>
					</div>
				</div>
				<LecturerIntroduction />
				<Instructors />
				<FeturedIn />
				<Footer />
			</div>
		</>
	);
}
