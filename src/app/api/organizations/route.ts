// import getUserData from "@/actions/getUserData";
import { supabaseBrowserClient } from "@/utils/supabeClient";
import { NextResponse } from "next/server";

import { getAuthSession } from "../auth/[...nextauth]/route";

export async function GET(req: any) {
    // const user = await getUserData();
    const session = await getAuthSession();

    try {
        const { data, error } = await supabaseBrowserClient
            .from('organizations_duplicate')
            .select('*, organization_participants_duplicate!inner(user_id)')
            .eq('organization_participants_duplicate.user_id', session.user.id /*user.id*/);

        if (error) throw error;
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}

export async function POST(req: any) {
    const { name } = await req.json();

    try {
        // const user = await getUserData();
        const session = await getAuthSession();
        console.log(session);

        const { data, error } = await supabaseBrowserClient
            .from('organizations_duplicate')
            .insert([{ name, creator_id: session.user.id }])
            .select();

        if (error) throw error;

        // Add creator as initial participant
        await supabaseBrowserClient
            .from('organization_participants_duplicate')
            .insert([{ organization_id: data[0].id, user_id: session.user.id }]);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}

export async function DELETE(req: any) {
    const { id } = await req.json();

    try {
        // const user = await getUserData();
        const session = await getAuthSession();


        // check if user is in organization
        const { data: organization, error: getOrganizationError } = await supabaseBrowserClient
            .from('organizations_duplicate')
            .select(`organization_participants_duplicate (user_id)`)
            .eq('id', id)
            .single();

        if (getOrganizationError) throw getOrganizationError;

        if (!organization.organization_participants_duplicate.find(participants => participants.user_id === session.user.id)) {
            return NextResponse.json({ success: false }, { status: 401 });
        }

        const { data, error } = await supabaseBrowserClient
            .from('organizations_duplicate')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}

