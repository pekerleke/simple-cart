import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { i18nRouter } from 'next-i18n-router';
import { i18n } from '../i18n';

export { default } from "next-auth/middleware"

export async function middleware(req: any) {
    const token = await getToken({ req });
    const demoUser = req.cookies.get("demoUser");
    const localeCookie = req.cookies.get("locale");
    const url = req.nextUrl;

    if (!localeCookie) {
        const acceptLanguage = req.headers.get("accept-language");
        const detectedLocale = acceptLanguage?.split(",")[0].split("-")[0] || "en";

        const response = NextResponse.redirect(url);
        response.cookies.set("locale", detectedLocale, { path: "/", httpOnly: false });

        return response;
    }

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