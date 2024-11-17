// import getUserData from "@/actions/getUserData";
import { supabaseBrowserClient } from "@/utils/supabeClient";
import { NextResponse } from "next/server";
// import { getAuthSession } from "../auth/[...nextauth]/route";
import { getAuthSession } from "../auth/[...nextauth]/getAuthSession";

export async function GET(req: any) {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organization');

    // TODO: check that user is in the organization

    try {
        const { data, error } = await supabaseBrowserClient
            .from('products_duplicate')
            .select('*')
            .eq('organization_id', organizationId);

        if (error) throw error;
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    } 
}

export async function POST(req: any) {
    const { name, price, priority } = await req.json();

    // TODO: check that user is in the organization

    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');

    // const user = await getUserData();
    const session = await getAuthSession();

    try {
        const { data, error } = await supabaseBrowserClient
            .from('products_duplicate')
            .insert([{ name, price, priority, user_id: session.user.id, organization_id: organizationId }]);

        if (error) throw error;
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}

export async function PATCH(req: any) {
    const { id, name, price, priority } = await req.json();

    // TODO: check that user is in the organization

    try {
        const { data, error } = await supabaseBrowserClient
            .from('products_duplicate')
            .update({ name, price, priority })
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}

export async function DELETE(req: any) {
    const { id } = await req.json();

    // TODO: check that user is in the organization
    
    try {
        const { data, error } = await supabaseBrowserClient
            .from('products_duplicate')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}