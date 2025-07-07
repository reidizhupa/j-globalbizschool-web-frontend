import { useTranslations } from "next-intl";
import Image from "next/image";

export default function JGlobalBusinessSchool() {
	const tHome = useTranslations("HomePage");

	return (
		<div className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
			{/* Complex background pattern */}
			<div className="absolute inset-0 opacity-20 -z-10 pointer-events-none">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#dbeafe_1px,transparent_1px)] bg-[size:40px_40px]" />
				<div className="absolute inset-0 bg-[linear-gradient(to_bottom,#dbeafe_1px,transparent_1px)] bg-[size:40px_40px]" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#3b82f6_0.5px,transparent_0.5px)] bg-[size:20px_20px]" />
			</div>

			{/* Floating decorative elements */}
			<div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-blue-100/30 blur-xl -z-10" data-aos="fade-in" data-aos-delay="300" data-aos-duration="1500" />
			<div className="absolute bottom-1/3 right-20 w-40 h-40 rounded-full bg-indigo-100/30 blur-xl -z-10" data-aos="fade-in" data-aos-delay="500" data-aos-duration="1500" />
			<div className="absolute top-1/4 right-1/4 w-24 h-24 rounded-full bg-blue-200/20 blur-lg -z-10" data-aos="fade-in" data-aos-delay="700" data-aos-duration="1500" />

			{/* Hero Section */}
			<section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-15 pt-20 md:pt-28 text-center">
				<div className="relative inline-block" data-aos="fade-up" data-aos-duration="800">
					<h1 className="text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-10">
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#285677] via-[#3a6b8f] to-[#5282a4] relative z-10">{tHome("whyChooseUs")}</span>
					</h1>
					<div className="absolute -bottom-2 left-0 right-0 h-2 bg-blue-100/50 rounded-full mx-auto w-3/4" />
				</div>
				<p className="text-xl md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto relative" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
					{tHome("reason")}
					<span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
				</p>
			</section>

			{/* Features Grid */}
			<section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
					{[
						{
							title: tHome("skillsReasonablePrice"),
							text: tHome("skillsReasonablePriceDescription"),
							color: "blue",
							href: "#",
							iconBg: "bg-blue-400",
							textColor: "text-blue-600",
							iconSrc: "/icons/piggy-bank.png",
							gradient: "from-blue-100 to-blue-50",
						},
						{
							title: tHome("customizedLearning"),
							text: tHome("customizedLearningDescription"),
							color: "indigo",
							href: "#",
							iconBg: "bg-indigo-400",
							textColor: "text-indigo-600",
							iconSrc: "/icons/laptop.png",
							gradient: "from-indigo-100 to-indigo-50",
						},
						{
							title: tHome("interculturalMindset"),
							text: tHome("interculturalMindsetDescription"),
							color: "purple",
							href: "#",
							iconBg: "bg-purple-400",
							textColor: "text-purple-600",
							iconSrc: "/icons/language.png",
							gradient: "from-purple-100 to-purple-50",
						},
					].map(({ title, text, iconBg, iconSrc, gradient }, i) => (
						<div key={i} className="relative group bg-white p-8 rounded-3xl border border-gray-100 shadow-lg overflow-hidden flex flex-col items-center text-center" data-aos="fade-up" data-aos-delay={200 + i * 200} data-aos-duration="500">
							{/* Decorative corner accent */}
							<div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${gradient} rounded-bl-3xl opacity-80`} />

							{/* Icon with subtle glow */}
							<div className={`relative w-20 h-20 ${iconBg} rounded-xl flex items-center justify-center mb-6 shadow-md`}>
								<Image src={iconSrc} alt={`${title} icon`} width={35} height={35} className="z-10" />
								<div className="absolute inset-0 rounded-xl opacity-30 bg-white" />
							</div>

							{/* Title with decorative underline */}
							<div className="relative mb-8">
								<h3 className="text-xl font-bold text-[#285677] max-w-[200px]">{title}</h3>
								<div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full" />
							</div>

							{/* Text with subtle border */}
							<div className="relative pt-4">
								<p className="text-gray-600 text-lg leading-relaxed relative">{text}</p>
							</div>

							{/* Subtle bottom accent */}
							<div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent" />
						</div>
					))}
				</div>
			</section>

			{/* Decorative bottom element */}
			<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-50/50 to-transparent -z-10" data-aos="fade-up" data-aos-delay="500" data-aos-duration="1000" />
		</div>
	);
}
