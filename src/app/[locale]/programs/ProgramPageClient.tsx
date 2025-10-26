// --- Client Component to log errors ---
"use client";
import WorkshopDetail, { Workshop } from "@/app/components/programs/WorkshopDetails";
import { useEffect } from "react";

export function ProgramPageClient({ workshop, fetchError }: { workshop: Workshop; fetchError?: string }) {
	useEffect(() => {
		if (fetchError) console.error("FileMaker fetch error (from server):", fetchError);
	}, [fetchError]);

	return <WorkshopDetail workshop={workshop} />;
}
