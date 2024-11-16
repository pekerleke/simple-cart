// import getUserData from "@/actions/getUserData";
import { supabaseBrowserClient } from "@/utils/supabeClient";
import { NextResponse } from "next/server";
import { getAuthSession } from "../auth/[...nextauth]/route";

export async function GET(req: any) {
    // const user = await getUserData();
    // const session = await getAuthSession();

    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');

    try {
        const { data, error } = await supabaseBrowserClient
            .from('sales_duplicate')
            .select('*')
            .eq('organization_id', organizationId);

        if (error) throw error;
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}

export async function POST(req: any) {
    const { products, organization } = await req.json();

    // const user = await getUserData();

    const session = await getAuthSession();

    try {
        const { data, error } = await supabaseBrowserClient
            .from('sales_duplicate')
            .insert([{ products, organization_id: organization, user_id: session.user.id }]);

        if (error) throw error;
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}