// app/[locale]/free-coaching/page.tsx
"use server";
import { generatePageMetadata } from "@/lib/seo";
import type { Metadata, ResolvingMetadata } from "next";
import FreeCoachingClient from "./FreeCoachingClient";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
	return generatePageMetadata(props, parent, "seo");
	//Hello
}

export default async function Page() {
	return <FreeCoachingClient />;
}
