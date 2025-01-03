
import { supabaseBrowserClient } from "@/utils/supabeClient";
import { NextResponse } from "next/server";
import { getAuthSession } from "../auth/[...nextauth]/getAuthSession";

export async function GET(req: any) {
    const session = await getAuthSession();

    try {
        const { data, error } = await supabaseBrowserClient
            .from('organizations')
            .select('*, organization_participants!inner(user_id)')
            .eq('organization_participants.user_id', session.user.id /*user.id*/);

        if (error) throw error;
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}

export async function POST(req: any) {
    const { name } = await req.json();

    try {
        const session = await getAuthSession();

        const { data, error } = await supabaseBrowserClient
            .from('organizations')
            .insert([{ name, creator_id: session.user.id }])
            .select();

        if (error) throw error;

        // Add creator as initial participant
        await supabaseBrowserClient
            .from('organization_participants')
            .insert([{ organization_id: data[0].id, user_id: session.user.id }]);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}

export async function PATCH(req: any) {
    const body = await req.json();

    try {
        const session = await getAuthSession();

        const { data: organization, error } = await supabaseBrowserClient
            .from('organizations')
            .select(`
                id,
                organization_participants (id, user_id)
              `)
            .eq('id', body.id)
            .single();
        
        if (error) throw error;

        if (!organization.organization_participants.find(participant => participant.user_id === session.user.id)) {
            return NextResponse.json(null, { status: 401 });
        }

        const { error: updateError } = await supabaseBrowserClient
            .from('organizations')
            .update({ name: body.name })
            .eq('id', organization.id);

        if (updateError) throw error;

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}

export async function DELETE(req: any) {
    const { id } = await req.json();

    try {
        const session = await getAuthSession();

        // check if user is in organization
        const { data: organization, error: getOrganizationError } = await supabaseBrowserClient
            .from('organizations')
            .select(`organization_participants (user_id)`)
            .eq('id', id)
            .single();

        if (getOrganizationError) throw getOrganizationError;

        if (!organization.organization_participants.find(participants => participants.user_id === session.user.id)) {
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

