import getUserData from "@/actions/getUserData";
import { supabaseBrowserClient } from "@/utils/supabeClient";
import { NextResponse } from "next/server";

export async function GET(req: any, { params }: any) {
    const user = await getUserData();
    const { id: organizationId } = params;

    if (!user) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    try {
        const { data: organization, error } = await supabaseBrowserClient
            .from('organizations')
            .select(`
                name, id,
                products (id, name, price, priority),
                organization_participants (id, user_id, users (full_name, avatar_url))
              `)
            .eq('id', organizationId)
            .single();

        if (error) throw error;

        if (!organization.organization_participants || organization.organization_participants.length === 0) {
            return NextResponse.json(null, { status: 200 });
        }

        if (!organization.organization_participants.find(participant => participant.user_id === user.id)) {
            return NextResponse.json(null, { status: 401 });
        }

        return NextResponse.json({ success: true, organization }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}