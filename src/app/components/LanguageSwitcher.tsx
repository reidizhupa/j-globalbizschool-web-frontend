// components/LanguageSwitcher.tsx
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";

export default function LanguageSwitcher() {
	const router = useRouter();
	const pathname = usePathname();
	const currentLocale = useLocale();
	const [isOpen, setIsOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Fix hydration issues by only rendering on client side
	useEffect(() => {
		setMounted(true);
	}, []);
	// Handle click outside to close dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);
	const handleLanguageChange = (locale: string) => {
		router.replace(pathname, { locale });
		setIsOpen(false);
	};
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const getLanguageName = (localeCode: string) => {
		switch (localeCode) {
			case "en":
				return "English";
			case "jp":
				return "日本語";
			default:
				return localeCode;
		}
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100" aria-haspopup="true" aria-expanded={isOpen}>
				<div className="w-5 h-4 relative">
					<Image src={`/flags/${currentLocale}.png`} alt={currentLocale} width={20} height={20} sizes="20px" className="object-cover rounded-sm" />
				</div>
				<span className="text-sm font-medium">{getLanguageName(currentLocale)}</span>
				<svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{isOpen && (
				<div className="absolute right-0 z-10 w-40 mt-2 bg-white rounded-md shadow-lg">
					<div className="py-1">
						{routing.locales.map((locale) => (
							<button key={locale} onClick={() => handleLanguageChange(locale)} className={`flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 ${currentLocale === locale ? "bg-gray-50 font-semibold" : ""}`}>
								<div className="w-5 h-4 relative mr-2">
									<Image src={`/flags/${locale}.png`} alt={locale} width={20} height={16} className="object-cover" />
								</div>
								{getLanguageName(locale)}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
