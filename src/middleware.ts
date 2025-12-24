import { withAuth } from "next-auth/middleware";

export default withAuth({
	callbacks: {
		authorized: ({ token }) => !!token,
	},
	pages: {
		signIn: "/auth/login",
	},
	secret: process.env.NEXTAUTH_SECRET,
});

export const config = {
	matcher: ["/cart", "/allorders", "/wishlist"],
};
