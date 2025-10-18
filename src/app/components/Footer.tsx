// components/Footer.tsx
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
	return (
		<footer className="bg-gray-50 border-t border-gray-200">
			<div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-gray-700">
				{/* Company Info */}
				<div>
					<h3 className="text-lg font-semibold text-gray-900 mb-3">Company</h3>
					<p className="text-sm leading-relaxed">
						<strong>J-Global, Inc.</strong> <br />
						J-Global Co., Ltd.
					</p>
				</div>

				{/* Office */}
				<div>
					<h3 className="text-lg font-semibold text-gray-900 mb-3">Office</h3>
					<p className="text-sm leading-relaxed">1-3-9 Uehara, Shibuya-ku, Tokyo, 151-0064, Japan</p>
				</div>

				{/* Contact */}
				<div>
					<h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>
					<ul className="space-y-2 text-sm">
						<li>
							<span className="font-medium">Call:</span> 090-2444-6692
						</li>
						<li>
							<span className="font-medium">Email:</span>{" "}
							<a href="mailto:support@j-global.com" className="text-blue-600 hover:underline">
								support@j-global.com
							</a>
						</li>
					</ul>
				</div>

				{/* Links */}
				<div>
					<h3 className="text-lg font-semibold text-gray-900 mb-3">Links</h3>
					<ul className="space-y-2 text-sm">
						<li>
							<a href="#" className="hover:text-blue-600 transition">
								お問い合わせ
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-blue-600 transition">
								Privacy Policy
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-blue-600 transition">
								Company Profile
							</a>
						</li>
					</ul>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="border-t border-gray-200 ">
				<div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
					{/* Logo */}
					<div className="flex items-center gap-2">
						<img src="/logo.png" alt="JBS Logo" className="h-15 w-auto" />
					</div>

					{/* Social Icons */}
					<div className="flex items-center gap-4 text-gray-500 text-xl">
						<a href="#" className="hover:text-blue-600 transition">
							<FaFacebookF />
						</a>
						<a href="#" className="hover:text-pink-600 transition">
							<FaInstagram />
						</a>
						<a href="#" className="hover:text-red-600 transition">
							<FaYoutube />
						</a>
					</div>

					{/* Copyright */}
					<p className="text-center md:text-right text-gray-500">Copyright © j-globalbizschool All Rights Reserved.</p>
				</div>
			</div>
		</footer>
	);
}
