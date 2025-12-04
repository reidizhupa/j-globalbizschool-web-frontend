"use client";

import Image from "next/image";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { getProgramLink } from "@/utils/helpers";

interface WorkshopHeroProps {
	title: string;
	subtitle: string;
	image: string;
	code: string;
	levelLabel: string;
	registerNowLabel: string;
	readMoreLabel: string;
	readLessLabel: string;
	locale: string;
}

export default function WorkshopHero({ title, subtitle, image, code, levelLabel, registerNowLabel, readMoreLabel, readLessLabel, locale }: WorkshopHeroProps) {
	const [expanded, setExpanded] = useState(false);

	return (
		<section className="relative text-white overflow-hidden">
			<div
				className="absolute inset-0"
				style={{
					backgroundImage: "url('/img/sun-tornado.svg')",
					backgroundSize: "cover",
					backgroundRepeat: "no-repeat",
					opacity: 0.6,
				}}
			/>
			<div className="absolute inset-0 bg-black/20"></div>

			<div className="relative max-w-6xl mx-auto px-6 py-20 mt-10 grid lg:grid-cols-2 gap-20 items-center space-between">
				<div className="space-y-6">
					<h1 className="text-5xl lg:text-5xl font-bold leading-tight">{title}</h1>
					<div className="text-lg text-blue-100 leading-relaxed">
						{subtitle && <p className={expanded ? "" : "line-clamp-3"}>{subtitle}</p>}
						{subtitle?.trim() !== "" && (
							<button className="mt-3 text-blue-100 border rounded-full px-5 py-1 hover:text-blue-50" onClick={() => setExpanded(!expanded)}>
								{expanded ? readLessLabel : readMoreLabel}
							</button>
						)}
					</div>
					<a href={getProgramLink(code, locale)} className="w-full bg-[#d74100] text-white py-4 rounded-full font-semibold shadow hover:bg-[#d74100] transition flex items-center justify-center gap-2">
						{registerNowLabel} <FaArrowRight />
					</a>
				</div>
				<div className="w-full flex justify-center">
					<div className="relative w-80 md:w-100 h-80">
						<Image src={image} alt={title} width={600} height={300} className="relative rounded-4xl shadow-2xl object-cover w-80 md:w-100 h-80 border-4 border-white/20" />
						<h3 className="absolute bottom-0 left-0 right-0 text-center text-xl font-semibold text-white bg-gradient-to-t from-blue-900/80 to-transparent px-3 py-1 rounded-2xl shadow-sm">{levelLabel}</h3>
					</div>
				</div>
			</div>
		</section>
	);
}
