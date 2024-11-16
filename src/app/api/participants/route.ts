import getUserData from "@/actions/getUserData";
import { supabaseBrowserClient } from "@/utils/supabeClient";
import { NextResponse } from "next/server";

export async function DELETE(req: any) {
    const { id } = await req.json();

    try {
        const user = await getUserData();

        // get participation
        const { data: participation, error: getParticipationError } = await supabaseBrowserClient
            .from('organization_participants_duplicate')
            .select(`*`)
            .eq('id', id)
            .single();

        if (getParticipationError) throw getParticipationError;

        // check if user is in organization
        const { data: organization, error: getOrganizationError } = await supabaseBrowserClient
            .from('organizations_duplicate')
            .select(`organization_participants_duplicate (user_id)`)
            .eq('id', participation.organization_id)
            .single();

        if (getOrganizationError) throw getOrganizationError;

        if (!organization.organization_participants_duplicate.find(participants => participants.user_id === user.id)){
            return NextResponse.json({ success: false }, { status: 401 });
        }

        // remove relation
        const { data, error } = await supabaseBrowserClient
            .from('organization_participants_duplicate')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}