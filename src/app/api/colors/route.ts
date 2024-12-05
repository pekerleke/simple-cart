import { supabaseBrowserClient } from "@/utils/supabeClient";
import { NextResponse } from "next/server";

export async function GET(req: any) {
    // const { searchParams } = new URL(req.url);
    // const organizationId = searchParams.get('organization');

    // TODO: check that user is in the organization

    try {
        const { data, error } = await supabaseBrowserClient
            .from('colors')
            .select('*');

        if (error) throw error;
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    } 
}