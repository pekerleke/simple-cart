'use server';

import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function supabaseServerClient() {
    const cookieStore = cookies();

    return createServerClient(
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
                    cookieStore.set({ name, value: '', ...options });
                },
            },
        }
    );
}