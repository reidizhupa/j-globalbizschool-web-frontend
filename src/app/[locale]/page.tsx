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

export async function generateMetadata(props: { params: Promise<{ locale: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
	/*

	------ CASE OF OVERRIDING SOME PARTS OF THE METADATA

	const baseMetadata = await generatePageMetadata(props, parent, "seo");
  const overrides = {
    title: "About Us - My Company",

  };
  return { ...baseMetadata, ...overrides };
  */

	return generatePageMetadata(props, parent, "seo");
}

export default function HomePage() {
	const tLevels = useTranslations("levels");

	const globalPrograms: CardGridData = {
		level: tLevels("level1"),
		title: tLevels("globalCommunication"),
		description: tLevels("globalCommunicationDescription"),
		stats: [
			{ icon: <BookOpen className="w-4 h-4" />, label: "24 Programs" },
			{ icon: <Briefcase className="w-4 h-4" />, label: "70 Workshops" },
		],
		cards: [
			{
				id: "CO1",
				title: "Intercultural Skills",
				image: "/img/globals/C01.jpg",
				link: "/courses/co1",
			},
			{
				id: "CO2",
				title: "Global Mindset",
				image: "/img/globals/C02.png",
				link: "/courses/co2",
			},
			{
				id: "CO3",
				title: "Growth Mindset",
				image: "/img/globals/C03.webp",
				link: "/courses/co3",
			},
			{
				id: "CO4",
				title: "Presentation",
				image: "/img/globals/C04.jpg",
				link: "/courses/co4",
			},
			{
				id: "BIZNITE",
				title: "Country Biz Nites",
				image: "/img/globals/biz-nite.jpg",
				link: "/events/biz-nite",
			},
		],
	};

	const globalTeamwork: CardGridData = {
		level: "Level 2",
		title: "Global Teamwork",
		description: "Elevate your career with effective teamwork skills. Focus on emotional intelligence, self-management, and win-win negotiation, building on strengths. Master feedback, project basics, and interactive meetings.Excel in supporting and facilitating diverse virtual teams, becoming a global collaboration expert.Includes team business games every two weeks",
		stats: [
			{ icon: <BookOpen className="w-4 h-4" />, label: "23 Programs" },
			{ icon: <Briefcase className="w-4 h-4" />, label: "65 Workshops" },
		],
		cards: [
			{
				id: "L12",
				title: "Teambuilding",
				image: "/img/globals/L12.webp",
				link: "/courses/co1",
			},
			{
				id: "CO6",
				title: "Negotiation",
				image: "/img/globals/C06.jpg",
				link: "/courses/co2",
			},
			{
				id: "F01",
				title: "Global Sales",
				image: "/img/globals/F01.avif",
				link: "/courses/co3",
			},
			{
				id: "F08",
				title: "Global Projects",
				image: "/img/globals/F08.jpg",
				link: "/courses/co4",
			},
			{
				id: "C09",
				title: "Business Game",
				image: "/img/globals/C09.png",
				link: "/events/biz-nite",
			},
		],
	};

	const globalLeadership: CardGridData = {
		level: "Level 3",
		title: "Global Leadership",
		description: "Unleash your global leadership potential. Acquire comprehensive leadership skills, including performance management, coaching, and strategic vision. Inspire diverse global employees, enhance project management capabilities, and excel in complex challenges.",
		stats: [
			{ icon: <BookOpen className="w-4 h-4" />, label: "14 Programs" },
			{ icon: <Briefcase className="w-4 h-4" />, label: "40 Workshops" },
		],
		cards: [
			{
				id: "L01",
				title: "Coaching",
				image: "/img/globals/L01.png",
				link: "/courses/co1",
			},
			{
				id: "L08",
				title: "Strategy",
				image: "/img/globals/L08.jpg",
				link: "/courses/co2",
			},
			{
				id: "I01",
				title: "Mini Internship",
				image: "/img/globals/C06.jpg",
				link: "/courses/co3",
			},
			{
				id: "L02",
				title: "Practical Thinking",
				image: "/img/globals/L02.avif",
				link: "/courses/co4",
			},
			{
				id: "L03",
				title: "Mini MBA",
				image: "/img/globals/C09.png",
				link: "/events/biz-nite",
			},
		],
	};
	return (
		<>
			<HeroSection />
			<JGlobalBusinessSchool />
			<JGlobalAchievements />
			<LogoSection />

			<FreeTrial />
			<div className="bg-[#dbe9ff] pt-20">
				<div className="bg-[url('/img/bg_continuation.png')] bg-cover bg-center bg-no-repeat">
					{/* Content */}
					<CardGridSection {...globalPrograms} align="left" />
					<CardGridSection {...globalTeamwork} align="right" />
					<CardGridSection {...globalLeadership} align="left" />
				</div>
			</div>
			<LecturerIntroduction />
			<Instructors />
		</>
	);
}
