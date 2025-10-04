"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import clsx from "clsx";

export type StatsItem = { icon: React.ReactNode; label: string };

export type Card = {
	id: string;
	title: string;
	image: string;
	link: string;
};

export type CardGridData = {
	level: string;
	title: string;
	description: string;
	stats?: StatsItem[];
	cards: Card[];
	align?: "left" | "center" | "right";
};

export default function CardGridSection({ level, title, description, align = "center", cards }: CardGridData) {
	return (
		<div className="relative overflow-hidden py-6">
			<div className="max-w-7xl mx-auto  bg-white/40 p-10 rounded-4xl">
				{/* Header */}
				<section
					className={clsx("mb-10 flex flex-col", {
						"items-start": align === "left",
						"items-center": align === "center",
						"items-end": align === "right",
					})}
				>
					<span className="inline-block px-3 py-1 mb-3 text-sm font-bold text-white rounded-full bg-gradient-to-r from-[#285677] via-[#3a6b8f] to-[#5282a4]">{level}</span>
					<h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 flex items-center gap-2">{title}</h2>
					<p
						className={clsx("text-gray-500 text-lg max-w-3xl leading-relaxed", {
							"text-right": align === "right",
							"mx-auto": align === "center",
						})}
					>
						{description}
					</p>
				</section>

				{/* Cards Grid */}
				<section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 bg-white p-5 rounded-3xl shadow-md">
					{cards.map((card) => (
						<Link key={card.id} href={card.link} className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col" style={{ boxShadow: "0 0 10px rgba(31, 73, 124, 0.1)" }}>
							<div className="relative aspect-[4/3] w-full h-full shadow-2xl">
								<Image src={card.image} alt={card.title} fill className="object-cover transition-transform duration-300" />
								{/* Title overlapping the image */}
								<h3 className="absolute bottom-2 left-2 right-2 text-center text-sm font-semibold text-white bg-gray-800/60 px-2 py-1 rounded-md shadow-sm">{card.title}</h3>
							</div>
						</Link>
					))}
				</section>
			</div>
		</div>
	);
}
