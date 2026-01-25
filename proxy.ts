import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest): Promise<Response> | Response {
	const authCookie = request.cookies.get("admin_session");
	const { pathname } = request.nextUrl;

	// Allow access to /admin (login page) for everyone
	if (pathname === "/admin") {
		return NextResponse.next();
	}

	// Protect all other /admin routes - require authentication
	if (pathname.startsWith("/admin")) {
		if (authCookie?.value !== "true") {
			return NextResponse.redirect(new URL("/admin", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
};
