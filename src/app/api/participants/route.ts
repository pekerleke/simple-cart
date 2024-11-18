import getUserData from "@/actions/getUserData";
import { supabaseBrowserClient } from "@/utils/supabeClient";
import { NextResponse } from "next/server";
import { getAuthSession } from "../auth/[...nextauth]/getAuthSession";

export async function DELETE(req: any) {
    const { id } = await req.json();

    try {
        // const user = await getUserData();
        const session = await getAuthSession();

        // get participation
        const { data: participation, error: getParticipationError } = await supabaseBrowserClient
            .from('organization_participants')
            .select(`*`)
            .eq('id', id)
            .single();

        if (getParticipationError) throw getParticipationError;

        // check if user is in organization
        const { data: organization, error: getOrganizationError } = await supabaseBrowserClient
            .from('organizations')
            .select(`organization_participants (user_id)`)
            .eq('id', participation.organization_id)
            .single();

        if (getOrganizationError) throw getOrganizationError;

        if (!organization.organization_participants.find(participants => participants.user_id === session.user.id)){
            return NextResponse.json({ success: false }, { status: 401 });
        }

        // remove relation
        const { data, error } = await supabaseBrowserClient
            .from('organization_participants')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}