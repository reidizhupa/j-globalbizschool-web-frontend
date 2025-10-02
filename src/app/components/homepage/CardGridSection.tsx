"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import clsx from "clsx";

export type StatsItem = { icon: React.ReactNode; label: string };

export type Card = {
	id: string;
	title: string;
	image: string;
	link: string;
};

export type CardGridData = {
	title: string;
	description: string;
	stats?: StatsItem[];
	cards: Card[];
};

export default function CardGridSection({ title, description, stats = [], cards }: CardGridData) {
	const [isOpen, setIsOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		// detect if mobile
		const handleResize = () => setIsMobile(window.innerWidth < 640);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="relative overflow-hidden">
			<div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none" />

			<div className={clsx("max-w-7xl mx-auto px-4 pt-0")}>
				{/* Header */}
				<section className={clsx("text-center mb-8", isMobile ? "cursor-pointer select-none" : "")} onClick={() => isMobile && setIsOpen(!isOpen)}>
					<h2 className="text-4xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4 flex justify-center items-center gap-2">
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#285677] via-[#3a6b8f] to-[#5282a4]">{title}</span>
					</h2>

					<p className="text-gray-600 text-base md:text-lg max-w-4xl mx-auto leading-relaxed">{description}</p>

					{stats.length > 0 && (
						<div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[#d98b0e] text-sm font-medium mt-4">
							{stats.map(({ icon, label }, idx) => (
								<React.Fragment key={idx}>
									<div className="flex items-center gap-2">
										{icon}
										<span>{label}</span>
									</div>
									{idx !== stats.length - 1 && <span className="inline-block h-4 border-l border-[#d98b0e] opacity-50" aria-hidden="true" />}
								</React.Fragment>
							))}
						</div>
					)}
					{isMobile && (
						<span className={clsx("flex justify-center w-full transition-transform duration-300 ")}>
							Show more<span className={clsx(isOpen ? "rotate-180" : "rotate-0")}>▼</span>
						</span>
					)}
				</section>

				{/* Cards (only shown on desktop or when accordion is open) */}
				{(!isMobile || isOpen) && (
					<section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4 pb-6">
						{cards.map((card) => (
							<Link key={card.id} href={card.link} className="group relative bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col" style={{ boxShadow: "0 0 10px rgba(31, 73, 124, 0.1)" }}>
								<div className="absolute top-0 left-0 w-8 h-8 bg-[#1f497c] rounded-br-3xl opacity-5 pointer-events-none" />
								<div className="absolute bottom-0 right-0 w-8 h-8 bg-[#1f497c] rounded-tl-3xl opacity-5 pointer-events-none" />

								<div className="relative aspect-[4/3] w-full">
									<Image src={card.image} alt={card.title} fill className="object-cover transition-transform duration-300" />
									<div className="absolute top-2 left-2 bg-[#1f497c]/70 text-white text-xs font-semibold px-2 py-0.5 rounded-md shadow">{card.id}</div>
								</div>

								<div className="p-3 flex flex-col flex-grow">
									<h3 className="text-sm text-center font-semibold text-[#1f497c] group-hover:text-[#4a6ca3] transition-colors">{card.title}</h3>
									<div className="flex-grow" />
								</div>

								<span className="absolute inset-0" aria-hidden="true" />
							</Link>
						))}
					</section>
				)}
			</div>
		</div>
	);
}
