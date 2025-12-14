import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	reactStrictMode: true,

	// ✅ Forces `/page/en/` instead of `/page/en`
	trailingSlash: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "www.j-globalbizschool.com",
			},
		],
	},
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
