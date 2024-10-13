import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { type CookieOptions, createServerClient } from '@supabase/ssr';

export async function GET(request: Request) {
    console.log(request.url);
    const { searchParams/*, origin*/ } = new URL(request.url);
    const origin = "https://simple-cart-ruddy.vercel.app/";
    const code = searchParams.get('code');
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/';

    if (code) {
        const cookieStore = cookies();
        const supabase = createServerClient(
            "https://kfzxgxuhjkpplaihvkqo.supabase.co",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmenhneHVoamtwcGxhaWh2a3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3NTE4ODEsImV4cCI6MjA0NDMyNzg4MX0.J5X6vQyydWKN_3-1CyeqEqIn_vMRR1MyigdGxnn4tsA",
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.delete({ name, ...options });
                    },
                },
            }
        );
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return NextResponse.redirect(`${origin}`); // changed
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}