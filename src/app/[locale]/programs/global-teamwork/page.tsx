import ProgramsList, { Program } from "@/app/components/programs/ProgramsList";
import { useTranslations } from "next-intl";

export default function SomePage() {
	const tLevels = useTranslations("levels");

	const programs: Program[] = [
		{
			id: "L12",
			title: tLevels("teamBuilding"),
			image: "/img/globals/L12.webp",
			shortDescription: "Build effective teamwork skills across global teams.",
			url: "/programs/global-teamwork/l12-team-building",
		},
		{
			id: "CO6",
			title: tLevels("negotiation"),
			image: "/img/globals/C06.jpg",
			shortDescription: "Master negotiation strategies in international business.",
			url: "/programs/global-teamwork/C06-negotiation",
		},
		{
			id: "F01",
			title: tLevels("globalSales"),
			image: "/img/globals/F01.avif",
			shortDescription: "Boost your global sales and cross-cultural selling skills.",
			url: "/programs/global-teamwork/F01-global-sales",
		},
		{
			id: "F08",
			title: tLevels("globalProjects"),
			image: "/img/globals/F08.jpg",
			shortDescription: "Learn how to manage international projects successfully.",
			url: "/programs/global-teamwork/F08-global-projects",
		},
		{
			id: "C09",
			title: tLevels("businessGame"),
			image: "/img/globals/C09.png",
			shortDescription: "Engage in a business simulation game to test your skills.",
			url: "/programs/global-teamwork/c09-business-game",
		},
	];
	return (
		<main>
			<ProgramsList programs={programs} title={tLevels("globalTeamwork")} />
		</main>
	);
}
