import { useTranslations } from "next-intl";
import Image from "next/image";

export default function JGlobalBusinessSchool() {
	const tHome = useTranslations("homepage");

	return (
		<div id="why-us" className="relative bg-blue-50/50 overflow-hidden">
			{/* Hero Section */}
			<section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-15 pt-15 text-center">
				<div className="relative inline-block" data-aos="fade-up" data-aos-duration="800">
					<h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-10">
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1f497c] to-[#3a6bb7] relative z-10">{tHome("whyChooseUs")}</span>
					</h1>
				</div>
				<p className="text-xl md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto relative" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
					{tHome("reason")}
				</p>
			</section>

			{/* Features Grid */}
			<section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
					{[
						{
							title: tHome("skillsReasonablePrice"),
							text: tHome("skillsReasonablePriceDescription"),
							color: "blue",
							href: "#",
							iconBg: "bg-[#ffc576]",
							textColor: "text-blue-600",
							iconSrc: "/icons/piggy-bank.png",
							gradient: "from-blue-100 to-blue-50",
						},
						{
							title: tHome("customizedLearning"),
							text: tHome("customizedLearningDescription"),
							color: "indigo",
							href: "#",
							iconBg: "bg-[#FF7F7F]",
							textColor: "text-[#3a70c6]",
							iconSrc: "/icons/laptop.png",
							gradient: "from-blue-100 to-blue-50",
						},
						{
							title: tHome("interculturalMindset"),
							text: tHome("interculturalMindsetDescription"),
							color: "purple",
							href: "#",
							iconBg: "bg-[#85b5ff]",
							textColor: "text-purple-600",
							iconSrc: "/icons/language.png",
							gradient: "from-blue-100 to-blue-50",
						},
					].map(({ title, text, iconBg, iconSrc }, i) => (
						<div key={i} className="relative group bg-white p-8 rounded-3xl border border-gray-100 shadow-lg overflow-hidden flex flex-col items-center text-center" data-aos="fade-up" data-aos-delay={200 + i * 200} data-aos-duration="500">
							{/* Decorative corner accent */}

							<div className="flex items-center">
								{/* Icon with subtle glow */}
								<div className={`relative w-20 h-20 ${iconBg} mr-4 rounded-full flex items-center justify-center mb-6 shadow-md`}>
									<Image src={iconSrc} alt={`${title} icon`} width={35} height={35} className="z-10" />
									<div className="absolute inset-0 rounded-xl opacity-10 bg-white" />
								</div>

								{/* Title with decorative underline */}
								<div className="relative mb-8">
									<h3 className="text-md text-start font-bold text-[#285677] max-w-[200px]">{title}</h3>
								</div>
							</div>

							{/* Text with subtle border */}
							<div className="relative pt-2">
								<p className="text-gray-600 text-md leading-relaxed relative whitespace-pre-line">{text}</p>
							</div>

							{/* Subtle bottom accent */}
							<div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent" />
						</div>
					))}
				</div>
			</section>

			{/* Decorative bottom element */}
		</div>
	);
}
