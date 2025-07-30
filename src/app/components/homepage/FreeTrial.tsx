import Link from "next/link";
import React from "react";
import Image from "next/image";
const FreeTrialSection = () => {
	return (
		<div className="mt-0 mb-15 overflow-hidden">
			{" "}
			<div className="relative block bg-blue-50/50" style={{ transform: "scaleX(-1)" }}>
				<svg viewBox="0 0 1440 120" className="w-full text-[#1f497cd8]" fill="currentColor" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M0,64 C360,96 1080,32 1440,64 L1440,120 L0,120 Z" />
				</svg>
			</div>
			<div className="relative  w-full py-0  px-4  ">
				{/* Background Image with opacity */}
				<div className="absolute inset-0 -z-10">
					<div className="w-full h-full bg-[#1f497cd8] absolute inset-0 z-10" />
					<Image src="/img/prova3.png" alt="Background" className="w-full h-full object-cover opacity-20" />
				</div>

				<div className="max-w-2xl mx-auto relative z-20">
					<h1 className="text-white text-4xl font-bold text-center mb-8">まずは無料体験</h1>

					<div className="block md:flex  justify-center gap-6 mb-10">
						<div className="flex items-center justify-center text-white text-lg mb-3 md:mb-0">
							<span className="inline-flex items-center justify-center w-6 h-6 bg-white/20 rounded-full mr-3">✓</span>
							簡単登録で無料体験
						</div>
						<div className="flex items-center justify-center text-white text-lg">
							<span className="inline-flex items-center justify-center w-6 h-6 bg-white/20 rounded-full mr-3">✓</span>
							無料体験に登録
						</div>
					</div>
					<div className="text-center">
						<Link href="/free-trial" className="inline-block text-2xl text-white bg-[#f7a520] font-bold py-4 px-13 rounded-full hover:bg-[#f7a520]/90 transition-colors">
							無料体験に登録
						</Link>
					</div>
				</div>
			</div>
			<div className="relative" style={{ transform: "scaleY(-1)" }}>
				<svg viewBox="0 0 1440 120" className="w-full text-[#1f497cd8]" fill="currentColor" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M0,64 C360,96 1080,32 1440,64 L1440,120 L0,120 Z" />
				</svg>
			</div>
		</div>
	);
};

export default FreeTrialSection;
