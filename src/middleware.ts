import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	// Explicitly pass secret for Edge compatibility on Vercel
	const token = await getToken({ 
		req: request, 
		secret: process.env.NEXTAUTH_SECRET 
	});

	// Check for token existence - checking just 'token' is more reliable 
	// as it confirms a valid decrypted session exists
	if (token) {
		return NextResponse.next();
	}

	const loginUrl = new URL("/auth/login", request.url);
	loginUrl.searchParams.set(
		"callbackUrl",
		request.nextUrl.pathname + request.nextUrl.search
	);

	return NextResponse.redirect(loginUrl);
}

export const config = {
	matcher: ["/cart", "/allorders", "/wishlist"],
};
