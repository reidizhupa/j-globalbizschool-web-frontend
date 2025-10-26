import { ProgramPageClient } from "../../ProgramPageClient";

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
			dates: [""],
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
	modId: string;
};

type Session = {
	title: string;
	content: string[];
	dates: string[];
};

type FileMakerPortalData = Record<string, (FileMakerWorkshop | FileMakerEvent)[]>;

// --- Fetch function ---
async function fetchWorkshopBySlug(slug: string, locale: string): Promise<{ workshop: Workshop; error?: string }> {
	try {
		const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/fmp/records/programs/${slug}/`;
		const res = await fetch(url, { method: "GET", cache: "no-store" });

		if (!res.ok) {
			const text = await res.text();
			console.log("text");
			return { workshop: fallbackWorkshop, error: `FileMaker API failed: ${text}` };
		}

		let fmData;
		try {
			fmData = await res.json();
		} catch (parseErr) {
			return { workshop: fallbackWorkshop, error: `Failed to parse FileMaker API response as JSON: ${parseErr}` };
		}

		const record = fmData?.response?.data?.[0]?.fieldData;
		if (!record) {
			const x = JSON.stringify(fmData, null, 2);
			return { workshop: fallbackWorkshop, error: `No record data returned from FileMaker API: wait ${x}` };
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
				.map((event: FileMakerEvent) => `${event["WorkshopEvent::EventDate"]} ${event["WorkshopEvent::StartTime"]}`);

			return { title, content, dates: matchingDates };
		});

		const workshop: Workshop = {
			title: locale === "jp" ? record["ProgramType::ProgramTypeNameJ"] : record["ProgramType::ProgramTypeName"] || fallbackWorkshop.title,
			subtitle: locale === "jp" ? record.DescriptionJ : record.DescriptionE || fallbackWorkshop.subtitle,
			image: "/img/globals/L12.webp",
			purpose: locale === "jp" ? record.BenefitJ : record.BenefitE || fallbackWorkshop.purpose,
			participants: locale === "jp" ? record.PartecipantsJ : record.PartecipantsE || fallbackWorkshop.participants,
			objectives: locale === "jp" ? record.ObjectivesJ : record.ObjectivesE || fallbackWorkshop.objectives,
			language: locale === "jp" ? record.LanguageJ : record.LanguageE || fallbackWorkshop.language,
			sessions,
		};

		return { workshop };
	} catch (err) {
		return { workshop: fallbackWorkshop, error: `Failed to fetch or map FileMaker data: ${err}` };
	}
}

export default async function ProgramPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
	const awaitedParams = await params;
	const slug = awaitedParams.slug;
	const locale = awaitedParams.locale || "jp"; // default to Japanese

	const { workshop, error } = await fetchWorkshopBySlug(slug, locale);

	return <ProgramPageClient workshop={workshop} fetchError={error} />;
}
