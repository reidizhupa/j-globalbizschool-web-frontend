import WorkshopDetail, { Workshop } from "@/app/components/programs/WorkshopDetails";
import { generatePageMetadata } from "@/lib/seo";
import type { Metadata, ResolvingMetadata } from "next";
const fallbackWorkshop: Workshop = {
	title: "",
	subtitle: "",
	image: "/img/globals/presentation-C04.jpg",
	purpose: [""],
	participants: "",
	objectives: [""],
	language: "",
	sessions: [
		{
			title: "",
			content: [""],
			dates: [],
		},
	],
};

type FileMakerWorkshop = {
	recordId: string;
	"Workshop::WorkshopNameE": string;
	"Workshop::WorkshopNameJ": string;
	"Workshop::WorkshopNumber": number;
	"Workshop::WorkshopCode": string;
	"Workshop::PurposeE": string;
	"Workshop::PurposeJ": string;
	modId: string;
};

type FileMakerEvent = {
	recordId: string;
	"Workshop::WorkshopNameE": string;
	"Workshop::WorkshopNameJ": string;
	"WorkshopEvent::EventDate": string;
	"WorkshopEvent::StartTime": string;
	"WorkshopEvent::Duration": number;
	"WorkshopEvent::ZoomLink": string;
	"WorkshopEvent::ID": string;
	modId: string;
};

type Session = {
	title: string;
	content: string[];
	dates: { id: string; date: string; startTime: string }[];
};

type FileMakerPortalData = Record<string, (FileMakerWorkshop | FileMakerEvent)[]>;
export async function generateMetadata(props: { params: Promise<{ locale: string; slug: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
	const params = await props.params;

	// FIX: wrap params back into a Promise for generatePageMetadata
	return generatePageMetadata({ params: Promise.resolve(params) }, parent, "seo");
}

// --- Fetch function ---
async function fetchWorkshopBySlug(slug: string, locale: string): Promise<Workshop> {
	try {
		const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/fmp/records/programs/${slug}/`;
		const res = await fetch(url, { method: "GET", cache: "no-store" });

		if (!res.ok) {
			const text = await res.text();
			console.error("FileMaker API failed (non-OK response):", text);
			return fallbackWorkshop;
		}

		let fmData;
		try {
			fmData = await res.json();
		} catch (parseErr) {
			console.error("Failed to parse FileMaker API response as JSON:", parseErr);
			return fallbackWorkshop;
		}

		const record = fmData?.response?.data?.[0]?.fieldData;

		if (!record) {
			console.error("No record data returned from FileMaker API:", fmData);
			return fallbackWorkshop;
		}

		const events = fmData?.response?.data?.[0]?.portalData as FileMakerPortalData | undefined;

		const workshopsArray = (events ? (Object.values(events)[0] as FileMakerWorkshop[]) : []) ?? [];
		const datesArray = (events ? (Object.values(events)[1] as FileMakerEvent[]) : []) ?? [];

		const sessions: Session[] = workshopsArray.map((item: FileMakerWorkshop) => {
			const title = item[locale === "jp" ? "Workshop::WorkshopNameJ" : "Workshop::WorkshopNameE"]?.replace(/^\d+\.\s*/, "") || "";

			const purpose = item[locale === "jp" ? "Workshop::PurposeJ" : "Workshop::PurposeE"] || "";

			const content = purpose
				.split(/\r\r/)
				.map((s) => s.trim())
				.filter((s) => s.length > 0);

			const matchingDates = datesArray
				.filter((event: FileMakerEvent) => {
					const eventTitle = event[locale === "jp" ? "Workshop::WorkshopNameJ" : "Workshop::WorkshopNameE"]?.replace(/^\d+\.\s*/, "");
					return eventTitle === title;
				})
				.map((event: FileMakerEvent) => ({
					id: event["WorkshopEvent::ID"],
					date: event["WorkshopEvent::EventDate"],
					startTime: event["WorkshopEvent::StartTime"],
				}));

			return {
				title,
				content,
				dates: matchingDates,
			};
		});

		const code = slug.includes("-") ? slug.split("-").pop()! : slug;

		const normalizedCode = code.toUpperCase();

		return {
			title: locale === "jp" ? record["LearningProgramNameJ"] : record["LearningProgramNameE"] || fallbackWorkshop.title,
			subtitle: locale === "jp" ? record.DescriptionJ : record.DescriptionE || fallbackWorkshop.subtitle,
			image: `/img/globals/${normalizedCode}.webp`,
			purpose: locale === "jp" ? record.BenefitJ : record.BenefitE || fallbackWorkshop.purpose,
			participants: locale === "jp" ? record.PartecipantsJ : record.PartecipantsE || fallbackWorkshop.participants,
			objectives: locale === "jp" ? record.ObjectivesJ : record.ObjectivesE || fallbackWorkshop.objectives,
			language: locale === "jp" ? record.LanguageJ : record.LanguageE || fallbackWorkshop.language,
			sessions,
		};
	} catch (err) {
		console.error("Failed to fetch or map FileMaker data:", err);
		return fallbackWorkshop;
	}
}

// --- Page component with case-sensitive slug redirect ---
import { redirect } from "next/navigation";

export default async function ProgramPage(props: { params: Promise<{ locale: string; slug: string }> }) {
	const { locale, slug } = await props.params;
	const finalLocale = locale || "jp";

	// Force proper casing (or map from DB)
	const code = slug.includes("-") ? slug.split("-").pop()! : slug;

	const normalizedCode = code.toUpperCase();
	// Redirect if slug is not correctly cased
	if (slug !== normalizedCode) {
		redirect(`/${finalLocale}/programs/global-leadership/${normalizedCode}`);
	}

	const workshop = await fetchWorkshopBySlug(normalizedCode, finalLocale);
	return <WorkshopDetail workshop={workshop} code={normalizedCode} />;
}
