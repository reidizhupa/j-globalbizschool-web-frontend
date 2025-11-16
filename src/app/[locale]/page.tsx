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
import JBSWorkshopsBenefits from "../components/homepage/Benefits";
import JBSWorkshopsStructure from "../components/homepage/WorkshopStructure";

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
	const tHome = useTranslations("homepage");

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
				link: "/programs/global-communication/C01",
			},
			{
				id: "CO2",
				title: tLevels("globalMindset"),
				image: "/img/globals/global-mindset-C02.png",
				link: "/programs/global-communication/C02",
			},
			{
				id: "CO3",
				title: tLevels("growthMindset"),
				image: "/img/globals/growth-mindset-C03.webp",
				link: "/programs/global-communication/C03",
			},
			{
				id: "CO4",
				title: tLevels("presentation"),
				image: "/img/globals/presentation-C04.jpg",
				link: "/programs/global-communication/C04",
			},
			{
				id: "BIZNITE",
				title: tLevels("countryBizNites"),
				image: "/img/globals/country-biz-nites.jpg",
				link: "/programs/global-communication/E-AU01",
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
				link: "/programs/global-teamwork/L12",
			},
			{
				id: "CO6",
				title: tLevels("negotiation"),
				image: "/img/globals/C06.jpg",
				link: "/programs/global-teamwork/C06",
			},
			{
				id: "F01",
				title: tLevels("globalSales"),
				image: "/img/globals/F01.avif",
				link: "/programs/global-teamwork/F01",
			},
			{
				id: "F08",
				title: tLevels("globalProjects"),
				image: "/img/globals/F08.jpg",
				link: "/programs/global-teamwork/F08",
			},
			{
				id: "C09",
				title: tLevels("businessGame"),
				image: "/img/globals/C09.png",
				link: "/programs/global-teamwork/C09",
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
				link: "/programs/global-leadership/L01",
			},
			{
				id: "L08",
				title: tLevels("strategy"),
				image: "/img/globals/L08.jpg",
				link: "/programs/global-leadership/L08",
			},
			{
				id: "I01",
				title: tLevels("miniInternship"),
				image: "/img/globals/C06.jpg",
				link: "/programs/global-leadership/I01",
			},
			{
				id: "L02",
				title: tLevels("practicalThinking"),
				image: "/img/globals/L02.avif",
				link: "/programs/global-leadership/L02-2",
			},
			{
				id: "L03",
				title: tLevels("miniMBA"),
				image: "/img/globals/C09.png",
				link: "/programs/global-leadership/L03-2",
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
					<h1 className="text-2xl md:text-5xl text-center flex justify-center lg:text-5xl font-extrabold tracking-tight text-gray-600 mb-10">
						<span className="bg-clip-text  relative z-10"> {tHome("programsSectionSubtitle")}</span>
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
			<JBSWorkshopsBenefits />
			<JBSWorkshopsStructure />

			<LecturerIntroduction />
			<Instructors />
			<FeturedIn />
			<Footer />
		</>
	);
}
