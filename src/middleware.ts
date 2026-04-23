import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized({ req, token }) {
            // If accessing the vendor dashboard, require VENDOR role
            if (req.nextUrl.pathname.startsWith('/vendor')) {
                return token?.role === "VENDOR";
            }

            if (req.nextUrl.pathname.startsWith('/admin')) {
                return token?.role === "ADMIN";
            }

            // Default rule for everything else in the matcher
            return !!token;
        },
    },
});

export const config = {
    matcher: ["/vendor/:path*", "/admin/:path*"]
};
