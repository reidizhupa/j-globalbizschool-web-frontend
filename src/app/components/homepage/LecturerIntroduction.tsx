import { getLink } from "@/utils/helpers";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function LecturerIntroduction() {
	const tHome = useTranslations("homepage.LecturerIntroduction");
	const currentLocale = useLocale();

	return (
		<div className="relative bg-blue-50/40 overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-5xl mx-auto">
				{/* Header */}
				<div className="text-center mb-10" data-aos="fade-up">
					<h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#285677] via-[#3a6b8f] to-[#5282a4]">{tHome("lecturerIntroduction")}</h2>
				</div>

				{/* Compact Card Layout */}
				<div className="bg-white rounded-4xl  shadow-md p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start  gap-6 md:gap-10" data-aos="fade-up" data-aos-delay="100">
					{/* Image */}
					<div className="relative w-40 h-40 sm:w-40 sm:h-40 md:w-64 md:h-100 rounded-full overflow-hidden border-4 border-white shadow ring-1 ring-[#5282a4] shrink-0">
						<Image src="/img/jon.avif" alt="Jon Lynch, Lecturer" fill className="object-cover" />
					</div>

					{/* Content */}
					<div className="flex flex-col gap-4 text-gray-800 text-sm sm:text-base w-full">
						{/* Name */}
						<div>
							<h3 className="text-xl text-center md:text-start  font-bold text-[#285677]">{tHome("name")}</h3>
						</div>

						{/* Bio */}
						<p className="text-gray-500">{tHome("description")}</p>

						{/* Coaching Callout (still compact) */}
						<div className="bg-blue-50 border-l-4 border-[#1f497c] p-4 rounded-xl shadow-sm mt-2">
							<h3 className="text-sm font-semibold text-blue-800 mb-2">{tHome("coachingSupport")}</h3>
							<p className="text-blue-800 text-sm mb-6">{tHome("description2")}</p>
							<Link href={getLink("freeCoaching", currentLocale)} className="bg-[#1f497c] hover:bg-[#2a5a8e] text-white text-sm font-medium mt-2 px-4 py-2 rounded-xl transition">
								{tHome("bookCoaching")}
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
