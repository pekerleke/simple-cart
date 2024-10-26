import getUserData from "@/actions/getUserData";
import { supabaseBrowserClient } from "@/utils/supabeClient";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';


export async function POST(req: any) {
    const { organization_id: organizationId } = await req.json();
    const code = uuidv4();

    try {
        const user = await getUserData();

        // check permissions
        const { data: organization, error: getOrganizationError } = await supabaseBrowserClient
            .from('organizations')
            .select(`
                organization_participants (user_id)
              `)
            .eq('id', organizationId)
            .single();

        if (getOrganizationError) throw getOrganizationError;

        // create invite
        if (!organization.organization_participants.find(participant => participant.user_id === user.id)) {
            return NextResponse.json(null, { status: 401 });
        }

        const { data, error } = await supabaseBrowserClient
            .from('organization_invitations')
            .insert([{ organization_id: organizationId, code: code, expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) }])
            .select('code, expires_at')
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, data: data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}

export async function GET(req: any) {
    try {
        const { searchParams } = new URL(req.url);
        const invitationCode = searchParams.get('invitationCode');
        console.log(invitationCode);

        const { data: invitation, error: getInvitationError } = await supabaseBrowserClient
            .from('organization_invitations')
            .select(`
                created_at, expires_at,
                organizations (name)
            `)
            .eq('code', invitationCode)
            .single();

        if (getInvitationError) throw getInvitationError;

        return NextResponse.json({ success: true, data: invitation }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}