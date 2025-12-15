import WorkshopDetail, { Workshop } from "@/app/components/programs/WorkshopDetails";
import { AppLocale } from "@/i18n/config";
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

export async function generateMetadata(props: { params: Promise<{ locale: AppLocale; slug: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
	const { slug } = await props.params;

	return generatePageMetadata(props, parent, "seo", `/programs/global-teamwork/${slug}/`);
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
			const title = item[locale === "ja" ? "Workshop::WorkshopNameJ" : "Workshop::WorkshopNameE"]?.replace(/^\d+\.\s*/, "") || "";

			const purpose = item[locale === "ja" ? "Workshop::PurposeJ" : "Workshop::PurposeE"] || "";

			const content = purpose
				.split(/\r\r/)
				.map((s) => s.trim())
				.filter((s) => s.length > 0);

			const matchingDates = datesArray
				.filter((event: FileMakerEvent) => {
					const eventTitle = event[locale === "ja" ? "Workshop::WorkshopNameJ" : "Workshop::WorkshopNameE"]?.replace(/^\d+\.\s*/, "");
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

		return {
			title: locale === "ja" ? record["LearningProgramNameJ"] : record["LearningProgramNameE"] || fallbackWorkshop.title,
			subtitle: locale === "ja" ? record.DescriptionJ : record.DescriptionE || fallbackWorkshop.subtitle,
			image: `/img/globals/${slug}.webp`,
			purpose: locale === "ja" ? record.BenefitJ : record.BenefitE || fallbackWorkshop.purpose,
			participants: locale === "ja" ? record.PartecipantsJ : record.PartecipantsE || fallbackWorkshop.participants,
			objectives: locale === "ja" ? record.ObjectivesJ : record.ObjectivesE || fallbackWorkshop.objectives,
			language: locale === "ja" ? record.LanguageJ : record.LanguageE || fallbackWorkshop.language,
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
	const finalLocale = locale || "ja";
	// Force proper casing (or map from DB)
	const properSlug = slug.toUpperCase(); // replace with DB lookup if needed

	// Redirect if slug is not correctly cased
	if (slug !== properSlug) {
		redirect(`/${finalLocale}/programs/global-teamwork/${properSlug}`);
	}

	const workshop = await fetchWorkshopBySlug(properSlug, finalLocale);
	return <WorkshopDetail workshop={workshop} code={properSlug} />;
}
