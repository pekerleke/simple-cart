// import getUserData from "@/actions/getUserData";
import { supabaseBrowserClient } from "@/utils/supabeClient";
import { NextResponse } from "next/server";
import { getAuthSession } from "../../auth/[...nextauth]/getAuthSession";
// import { getAuthSession } from "../../auth/[...nextauth]/route";

export async function GET(req: any, { params }: any) {
    // const user = await getUserData();
    const session = await getAuthSession();

    const { id: organizationId } = params;

    if (!session?.user) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    try {
        const { data: organization, error } = await supabaseBrowserClient
            .from('organizations_duplicate')
            .select(`
                name, id,
                products_duplicate (id, name, price, priority),
                organization_participants_duplicate (id, user_id, users_duplicate (full_name, avatar_url))
              `)
            .eq('id', organizationId)
            .single();

        if (error) throw error;

        if (!organization.organization_participants_duplicate || organization.organization_participants_duplicate.length === 0) {
            return NextResponse.json(null, { status: 200 });
        }

        if (!organization.organization_participants_duplicate.find(participant => participant.user_id === session.user.id)) {
            return NextResponse.json(null, { status: 401 });
        }

        return NextResponse.json({ success: true, organization }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}