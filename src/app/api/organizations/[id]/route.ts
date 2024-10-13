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
        const { data: participants, error: participantError } = await supabaseBrowserClient
            .from('organization_participants')
            .select('user_id')
            .eq('organization_id', organizationId)
            .eq('user_id', user.id);

        if (participantError) throw participantError;

        // Si no hay datos, el usuario no pertenece a la organización
        if (!participants || participants.length === 0) {
            return NextResponse.json(null, { status: 200 });
        }

        const { data: organization, error } = await supabaseBrowserClient
            .from('organizations')
            .select(`
                name, id,
                products (id, name, price, priority)
              `)
            .eq('id', organizationId)
            .single();

        if (error) throw error;

        // return NextResponse.json(organization, { status: 200 });

        return NextResponse.json({ success: true, organization }, { status: 200 });
        // const { data, error } = await supabaseBrowserClient
        //     .from('organizations')
        //     .select('*, organization_participants!inner(user_id)')
        //     .eq('organization_participants.user_id', user.id);

        // if (error) throw error;
        // return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
    }
}