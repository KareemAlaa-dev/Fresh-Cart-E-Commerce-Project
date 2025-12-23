import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import { cache } from "react";

// --------------------
// Function: getToken()
// --------------------
// This function retrieves the access token from NextAuth cookies.
// It is wrapped in React's cache() to ensure that within a single 
// request lifecycle, the token is only retrieved and decoded once.
export const getToken = cache(async function getToken(): Promise<string | null> {
	const cookieStore = cookies();

	// Try to get the session token from either of the possible cookie names
	const token =
		(await cookieStore).get("__Secure-next-auth.session-token")?.value ??
		(await cookieStore).get("next-auth.session-token")?.value;

	if (!token) return null; // If no token found, return null

	// Decode the session token using NextAuth's secret key
	const session = await decode({
		token,
		secret: process.env.NEXTAUTH_SECRET!,
	});

	// Extract the accessToken if it exists and is a string
	const accessToken =
		typeof session?.accessToken === "string" ? session.accessToken : null;

	return accessToken;
});


// --------------------
// Function: userId()
// --------------------
// This function retrieves the user's ID from the decoded JWT access token.
// It is also cached per-request to avoid redundant decoding.
export const userId = cache(async function userId(): Promise<string | null> {
	const accessToken = await getToken();
	if (!accessToken) return null; // No access token means no user ID

	try {
		// Decode the JWT token to extract the user ID
		const decoded = jwt.decode(accessToken) as { id?: string } | null;
		const id = decoded?.id ?? null;

		return id;
	} catch (_error) {
		return null; // In case of an invalid token or decode error
	}
});


