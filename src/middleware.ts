import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);
export const config = {
	matcher: [
		"/", // root redirect
		"/(ja|en)/:path*", // prefixed locales
		"/((?!_next|_vercel|api|.*\\..*).*)", // <-- exclude /api
	],
};
