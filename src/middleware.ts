import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware"

export async function middleware(req: any) {
    const token = await getToken({ req });
    const demoUser = req.cookies.get("demoUser");
    const url = req.nextUrl;

    if (url.pathname.startsWith("/login")) {
        if (token || demoUser?.value === "true") {
            const redirectUrl = new URL('/', req.url);
            return NextResponse.redirect(redirectUrl);
        }
        return NextResponse.next();
    }

    if (token || demoUser?.value === "true") {
        return NextResponse.next();
    } else {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", req.url);
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: ["/", "/login", "/invitation", "/organization(.*)"]
}