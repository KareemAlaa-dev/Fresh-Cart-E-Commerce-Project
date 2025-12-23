"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function authHeaders() {
	const session = await getServerSession(authOptions);

	return {
		"Content-Type": "application/json",
		token: session?.accessToken ?? ""
	};
}
