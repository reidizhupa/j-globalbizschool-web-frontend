// app/[locale]/free-coaching/page.tsx
"use server";
import { generatePageMetadata } from "@/lib/seo";
import type { Metadata, ResolvingMetadata } from "next";
import FreeCoachingClient from "./FreeCoachingClient";

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

export default async function Page() {
	return <FreeCoachingClient />;
}
