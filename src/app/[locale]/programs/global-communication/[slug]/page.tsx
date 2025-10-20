// app/page1.tsx

import WorkshopDetail, { Workshop } from "@/app/components/programs/WorkshopDetails";

// Sample fallback data
const fallbackWorkshop: Workshop = {
	title: "Global Teamwork Skills: L12",
	image: "/img/globals/L12.webp",
	purpose: ["Leverage both Japanese and global business strengths to build trust and influence.", "Bring together diverse values and working styles to create high-performing teams based on mutual understanding."],
	participants: "For those who want to lead teams smoothly in a global environment and achieve results in project management and global team leadership.",
	objectives: ["Understand Japan’s team-based work culture and communication style.", "Establish effective hybrid teamwork across cultures.", "Enhance skills for effective feedback and trust-building."],
	language: "Bilingual in Japanese and English",
	sessions: [
		{
			title: "Bridging Communication Across Cultures",
			content: ["Learn about five Cross-Cultural Frameworks which show typical communication and mindset differences between Japanese and global colleagues:", "1. Mindset (Growth vs Fixed)", "2. Communication (High vs low context)", "3. Meeting styles (Socratic vs Confucian)", "4. Formality (Friendly vs Formal/TPO)", "5. Organization style (individual versus team responsibility)", "Discuss mindset and techniques to bridge these gaps and create an inclusive, hybrid working style."],
			dates: ["1/6/2026 TUE 16:00 - 17:00", "1/8/2026 THU 19:00 - 20:00", "1/12/2026 WED 21:15 - 22:15"],
		},
		{
			title: "Cross-Culture Problem Solving",
			content: ["Learn about five Cross-Cultural Frameworks which show typical working styles and leadership differences between Japanese and global colleagues:", "6. Time sense (fixed vs flexible)", "7. Change (Risk-taking vs careful)", "8. Decision-making (Top-down vs flat)", "9. Direction (Strategic vs end-user)", "10. Trust (contract vs relationship)", "Examine typical intercultural issues and effective methods to overcome them."],
			dates: ["2/3/2026 TUE 16:00 - 17:00", "2/12/2026 THU 19:00 - 20:00", "2/18/2026 WED 21:15 - 22:15"],
		},
	],
};
// Server component to fetch FileMaker data
async function fetchWorkshopBySlug(slug: string): Promise<Workshop> {
	try {
		const url = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/fmp/records/programs`;
		const res = await fetch(url, { cache: "no-store" });

		if (!res.ok) return fallbackWorkshop;

		const fmData = await res.json();

		const records = fmData?.response?.data || [];
		// Print all LearningProgramCodes
		console.log(records);

		// Find the record where LearningProgramCode matches the slug
		const record = records.find((r: any) => r.fieldData["LearningProgram::LearningProgramCode"]?.toLowerCase() === slug.toLowerCase())?.fieldData;
		console.log(record);
		if (!record) return fallbackWorkshop;

		const workshop: Workshop = {
			title: record.title || fallbackWorkshop.title,
			image: record.image || fallbackWorkshop.image,
			purpose: record.purpose || fallbackWorkshop.purpose,
			participants: record.participants || fallbackWorkshop.participants,
			objectives: record.objectives || fallbackWorkshop.objectives,
			language: record.language || fallbackWorkshop.language,
			sessions: record.sessions || fallbackWorkshop.sessions,
		};

		return workshop;
	} catch (err) {
		console.error("Failed to fetch or map FileMaker data:", err);
		return fallbackWorkshop;
	}
}

export default async function ProgramPage({ params: rawParams }: { params: any }) {
	const params = await rawParams; // <-- await here
	const slug = params.slug;
	const workshop = await fetchWorkshopBySlug(slug);

	return <WorkshopDetail workshop={workshop} />;
}
