import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;
	if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "dev-secret" });
		if (!token || (token as any).role !== "admin") {
			const loginUrl = new URL("/login", req.url);
			return NextResponse.redirect(loginUrl);
		}
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*", "/api/admin/:path*"],
};


