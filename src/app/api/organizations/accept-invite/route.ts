import getUserData from "@/actions/getUserData";
import { supabaseBrowserClient } from "@/utils/supabeClient";
import { NextResponse } from "next/server";

export async function POST(req: any) {
    const { invitationCode } = await req.json();
    // check:
    //   [-] not expired
    //   [*] user logged
    //   [*] user is already in organization

    try {
        const { data: invitation, error: getInvitationError } = await supabaseBrowserClient
            .from('organization_invitations')
            .select(`
                expires_at,
            organizations (id, organization_participants (user_id))
        `)
            .eq('code', invitationCode)
            .single();

        if (getInvitationError) throw getInvitationError;

        const user = await getUserData();

        if (!user) return NextResponse.json(null, { status: 401 });

        if (new Date(invitation.expires_at).getTime() < new Date().getTime()){
            return NextResponse.json({msg: "Ivitation already expired"}, { status: 400 });
        }

        console.log((invitation.organizations as any).organization_participants);
        if ((invitation.organizations as any).organization_participants.some((participant: any) => participant.user_id === user.id)){
            console.log("USER ALREADY IN ORGANIZATION");
        } else {
            // insert user

            // console.log((invitation.organizations as any).id, user.id)

            await supabaseBrowserClient
            .from('organization_participants')
            .insert([{ organization_id: (invitation.organizations as any).id, user_id: user.id }]);
        }

        return NextResponse.json({ success: true, data: {organizationId: (invitation.organizations as any).id} }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}