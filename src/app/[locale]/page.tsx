import getRequestConfig from "@/i18n/request";
import HeroSection from "@/app/components/homepage/HeroSection";
import JGlobalBusinessSchool from "@/app/components/homepage/WhyUs";
import JGlobalAchievements from "@/app/components/homepage/Achievements";
import FreeTrial from "@/app/components/homepage/FreeTrial";
import ThematicProgrammes from "@/app/components/homepage/ThematicProgrammes";
import CardGridSection, { CardGridData } from "@/app/components/homepage/CardGridSection";
import { BookOpen, Briefcase } from "lucide-react";
import LecturerIntroduction from "@/app/components/homepage/LecturerIntroduction";
import Instructors from "@/app/components/homepage/Instructors";
import { escapeHtml } from "@/utils/escapeHtml";
type GenerateMetadataParams = {
	params: {
		locale: string;
	};
};

export async function generateMetadata({ params }: GenerateMetadataParams) {
	const { locale } = await params;

	const configFn = await getRequestConfig;

	const messages = await configFn({
		requestLocale: Promise.resolve(locale),
	});

	return {
		title: escapeHtml(messages.messages && messages.messages["title"]) || "Default Title",
	};
}

const globalPrograms: CardGridData = {
	title: "Global Communication",
	description: "Activate your career by mastering global communication. Develop a global mindset and confidence to connect across cultures. Enhance active listening, clear information sharing, and positive body language. Gain an edge with scheduling, planning, presenting, and English communication skills, ready to excel in global business. Includes country culture biz nites - Includes “travelling” virtually to a different county each week",
	stats: [
		{ icon: <BookOpen className="w-4 h-4" />, label: "24 Programs" },
		{ icon: <Briefcase className="w-4 h-4" />, label: "70 Workshops" },
	],
	cards: [
		{
			id: "CO1",
			title: "Introduction to Global Communication",
			image: "/img/globals/C01.jpg",
			link: "/courses/co1",
		},
		{
			id: "CO2",
			title: "Knowledge for working in a global company",
			image: "/img/globals/C02.png",
			link: "/courses/co2",
		},
		{
			id: "CO3",
			title: "Mindset for success in global business",
			image: "/img/globals/C03.webp",
			link: "/courses/co3",
		},
		{
			id: "CO4",
			title: "Persuasive and clear presentations in a global environment",
			image: "/img/globals/C04.jpg",
			link: "/courses/co4",
		},
		{
			id: "BIZNITE",
			title: "International Biz Nite",
			image: "/img/globals/biz-nite.jpg",
			link: "/events/biz-nite",
		},
	],
};

const globalTeamwork: CardGridData = {
	title: "Global Teamwork",
	description: "Elevate your career with effective teamwork skills. Focus on emotional intelligence, self-management, and win-win negotiation, building on strengths. Master feedback, project basics, and interactive meetings.Excel in supporting and facilitating diverse virtual teams, becoming a global collaboration expert.Includes team business games every two weeks",
	stats: [
		{ icon: <BookOpen className="w-4 h-4" />, label: "23 Programs" },
		{ icon: <Briefcase className="w-4 h-4" />, label: "65 Workshops" },
	],
	cards: [
		{
			id: "L12",
			title: "Global Teamwork Skills",
			image: "/img/globals/L12.webp",
			link: "/courses/co1",
		},
		{
			id: "CO6",
			title: "Win-win Negotiating & Problem Solving",
			image: "/img/globals/C06.jpg",
			link: "/courses/co2",
		},
		{
			id: "F01",
			title: "Value-Selling Across Cultures",
			image: "/img/globals/F01.avif",
			link: "/courses/co3",
		},
		{
			id: "F08",
			title: "Project Management Across Cultures",
			image: "/img/globals/F08.jpg",
			link: "/courses/co4",
		},
		{
			id: "C09",
			title: "Global Business Role-playing games.",
			image: "/img/globals/C09.png",
			link: "/events/biz-nite",
		},
	],
};

const globalLeadership: CardGridData = {
	title: "Global Leadership",
	description: "Unleash your global leadership potential. Acquire comprehensive leadership skills, including performance management, coaching, and strategic vision. Inspire diverse global employees, enhance project management capabilities, and excel in complex challenges.",
	stats: [
		{ icon: <BookOpen className="w-4 h-4" />, label: "14 Programs" },
		{ icon: <Briefcase className="w-4 h-4" />, label: "40 Workshops" },
	],
	cards: [
		{
			id: "L01",
			title: "Global Teamwork Skills",
			image: "/img/globals/L01.png",
			link: "/courses/co1",
		},
		{
			id: "L08",
			title: "Win-win Negotiating & Problem Solving",
			image: "/img/globals/L08.jpg",
			link: "/courses/co2",
		},
		{
			id: "I01",
			title: "Value-Selling Across Cultures",
			image: "/img/globals/C06.jpg",
			link: "/courses/co3",
		},
		{
			id: "L02",
			title: "Project Management Across Cultures",
			image: "/img/globals/L02.avif",
			link: "/courses/co4",
		},
		{
			id: "L03",
			title: "Global Business Role-playing games.",
			image: "/img/globals/C09.png",
			link: "/events/biz-nite",
		},
	],
};
export default function HomePage() {
	return (
		<>
			<HeroSection />
			<JGlobalBusinessSchool />
			<JGlobalAchievements />
			<FreeTrial />
			<ThematicProgrammes />
			<svg viewBox="0 0 1440 120" className="w-full" preserveAspectRatio="none">
				{/* Bottom darker curve */}
				<path d="M0,0 C360,80 1080,80 1440,0 L1440,120 L0,120 Z" fill="#dde8ff" opacity="1" />
				{/* Top lighter curve */}
				<path d="M0,0 C360,100 1080,100 1440,0 L1440,120 L0,120 Z" fill="currentColor" className="text-blue-100" />
			</svg>

			<div className="relative bg-blue-50">
				{/* Top fade */}
				<div className="absolute top-0 left-0 right-0 h-100 bg-gradient-to-b from-blue-100 to-blue-50 pointer-events-none" />

				{/* Bottom fade */}
				<div className="absolute bottom-0 left-0 right-0 h-100 bg-gradient-to-t from-blue-100 to-blue-50 pointer-events-none" />

				{/* Content */}
				<CardGridSection {...globalPrograms} />
				<CardGridSection {...globalTeamwork} />
				<CardGridSection {...globalLeadership} showWave={false} />
			</div>

			<div className="rotate-180">
				<svg viewBox="0 0 1440 120" className="w-full" preserveAspectRatio="none">
					{/* Bottom darker curve */}
					<path d="M0,0 C360,80 1080,80 1440,0 L1440,120 L0,120 Z" fill="#dde8ff" opacity="1" />
					{/* Top lighter curve */}
					<path d="M0,0 C360,100 1080,100 1440,0 L1440,120 L0,120 Z" fill="currentColor" className="text-blue-100" />
				</svg>
			</div>
			<LecturerIntroduction />
			<Instructors />
		</>
	);
}
