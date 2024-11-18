// import getUserData from "@/actions/getUserData";
import { supabaseBrowserClient } from "@/utils/supabeClient";
import { NextResponse } from "next/server";
// import { getAuthSession } from "../auth/[...nextauth]/route";
import { getAuthSession } from "../auth/[...nextauth]/getAuthSession";

export async function GET(req: any) {
    // const user = await getUserData();
    // const session = await getAuthSession();

    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');

    try {
        const { data, error } = await supabaseBrowserClient
            .from('sales')
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
            .from('sales')
            .insert([{ products, organization_id: organization, user_id: session.user.id }]);

        if (error) throw error;
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}

export async function DELETE(req: any) {
    const { id } = await req.json();

    const session = await getAuthSession();

    try {
        const { data: sale, error: saleError } = await supabaseBrowserClient
            .from('sales')
            .select('*')
            .eq('id', id)
            .single();

        if (saleError) throw saleError;

        const { data: organization, error: getOrganizationError } = await supabaseBrowserClient
            .from('organizations')
            .select(`organization_participants (user_id)`)
            .eq('id', sale.organization_id)
            .single();

        if (getOrganizationError) throw getOrganizationError;

        if (!organization.organization_participants.find(participants => participants.user_id === session.user.id)){
            return NextResponse.json({ success: false }, { status: 401 });
        }

        const { error } = await supabaseBrowserClient
            .from('sales')
            .delete()
            .eq('id', sale.id);

        if (error) throw error;

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}