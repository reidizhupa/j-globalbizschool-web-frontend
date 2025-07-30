import Image from "next/image";

export default function LecturerIntroduction() {
	return (
		<div className="relative bg-blue-50/40 overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-5xl mx-auto">
				{/* Header */}
				<div className="text-center mb-10" data-aos="fade-up">
					<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#285677] via-[#3a6b8f] to-[#5282a4]">Lecturer Introduction</h1>
					<div className="w-20 h-1 mx-auto mt-2 bg-blue-100 rounded-full" />
				</div>

				{/* Compact Card Layout */}
				<div className="bg-white rounded-2xl  shadow-md p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start  gap-6 md:gap-10" data-aos="fade-up" data-aos-delay="100">
					{/* Image */}
					<div className="relative w-40 h-40 sm:w-40 sm:h-40 md:w-64 md:h-100 rounded-full overflow-hidden border-4 border-white shadow ring-1 ring-[#5282a4] shrink-0">
						<Image src="/img/jon.avif" alt="Jon Lynch, Lecturer" fill className="object-cover" />
					</div>

					{/* Content */}
					<div className="flex flex-col gap-4 text-gray-800 text-sm sm:text-base w-full">
						{/* Name */}
						<div>
							<h2 className="text-xl font-bold text-[#285677]">Jon Lynch</h2>
							<p className="text-sm text-gray-500">Founder, J-Global Co., Ltd.</p>
						</div>

						{/* Bio */}
						<p>Originally from the UK, Jon currently lectures on global business skills at Hitotsubashi University. After coming to Japan in 1990, he taught international business communication skills as a cross-cultural business instructor at major training companies, and then in media/marketing companies. He established the training and consulting company J-Global Co., Ltd. in 2010. Utilizing his extensive business experience in Japan, he has provided services to over 100 Japanese and foreign companies. We offer bilingual workshops in Japanese/English with the aim of spreading the &quot;&quot;J-Global&quot; best-mix way of working, which combines the strengths of Japanese and other countries.&apos; business styles</p>

						{/* Coaching Callout (still compact) */}
						<div className="bg-blue-50 border-l-4 border-[#1f497c] p-4 rounded-xl shadow-sm mt-2">
							<h3 className="text-sm font-semibold text-blue-900 mb-2">Free 1-on-1 Online Coaching</h3>
							<p className="text-blue-800 text-sm mb-2">We will discuss your career path ideas together in a relaxing 20 minute conversation while creating a mind map to visually and logically show your thoughts. Either Japanese or English is OK, and you can enjoy this service whether or not you decide to participate in our programs.</p>
							<button className="bg-[#1f497c] hover:bg-[#2a5a8e] text-white text-sm font-medium px-4 py-2 rounded-md transition">Book Coaching</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
