import getUserData from "@/actions/getUserData";
import { supabaseBrowserClient } from "@/utils/supabeClient";
import { NextResponse } from "next/server";

export async function GET(req: any) {
    const user = await getUserData();

    try {
        const { data, error } = await supabaseBrowserClient
            .from('organizations')
            .select('*, organization_participants!inner(user_id)')
            .eq('organization_participants.user_id', user.id);

        if (error) throw error;
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}

export async function POST(req: any) {
    const { name } = await req.json();

    try {
        const user = await getUserData();
        const { data, error } = await supabaseBrowserClient
            .from('organizations')
            .insert([{ name, creator_id: user.id }])
            .select();

        if (error) throw error;

        // Add creator as initial participant
        await supabaseBrowserClient
            .from('organization_participants')
            .insert([{ organization_id: data[0].id, user_id: user.id }]);

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}

export async function DELETE(req: any) {
    const { id } = await req.json();

    try {
        const user = await getUserData();
        // check if user is in organization
        const { data: organization, error: getOrganizationError } = await supabaseBrowserClient
            .from('organizations')
            .select(`organization_participants (user_id)`)
            .eq('id', id)
            .single();

        if (getOrganizationError) throw getOrganizationError;

        if (!organization.organization_participants.find(participants => participants.user_id === user.id)) {
            return NextResponse.json({ success: false }, { status: 401 });
        }

        const { data, error } = await supabaseBrowserClient
            .from('organizations')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}

