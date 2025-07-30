import { useTranslations } from "next-intl";
import Image from "next/image";

export default function JGlobalAchievements() {
	const tHome = useTranslations("HomePage");

	return (
		<div>
			<section className="relative overflow-hidden bg-blue-50/50 py-5">
				{/* Background image layer */}

				<div className="absolute inset-0 z-0 mix-blend-multiply" />

				{/* Content */}
				<div className="relative z-10 max-w-7xl mx-auto px-6">
					{/* Hero Section */}
					<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-15 pt-5 text-center">
						<div className="relative inline-block" data-aos="fade-up" data-aos-duration="600">
							<h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-10">
								<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#285677] via-[#3a6b8f] to-[#5282a4] relative z-10"> {tHome("achievements")}</span>
							</h1>
							<div className="absolute -bottom-2 left-0 right-0 h-2 bg-blue-100/50 rounded-full mx-auto w-3/4" />
						</div>
						<p className="text-xl md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto relative" data-aos="fade-up" data-aos-delay="200" data-aos-duration="600">
							{tHome("achievementsDescription")}
							<span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
						</p>
					</section>

					{/* Grid Layout */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pb-5">
						{/* Image */}
						<div className="overflow-hidden rounded-3xl shadow-lg" data-aos="fade-right" data-aos-delay="200" data-aos-duration="600">
							<Image src="/img/people.avif" alt="Workshop team celebrating" width={600} height={400} className="w-full h-full object-cover" />
						</div>

						{/* Text Box */}
						<div className="md:p-10 md:bg-white/70 rounded-3xl" data-aos="fade-left" data-aos-delay="200" data-aos-duration="600">
							<p className="text-gray-700 text-lg leading-relaxed mb-6">{tHome("achievementsSection1")}</p>
							<p className="text-gray-700 text-lg leading-relaxed mb-6">{tHome("achievementsSection2")}</p>
							<p className="text-gray-700 text-lg leading-relaxed">{tHome("achievementsSection3")}</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
