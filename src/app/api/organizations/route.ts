import getUserData from "@/actions/getUserData";
import { supabaseBrowserClient } from "@/utils/supabeClient";
import { NextResponse } from "next/server";

export async function GET(req) {
    const user = await getUserData();

    try {
        const { data, error } = await supabaseBrowserClient
            .from('organizations')
            .select('*, organization_participants!inner(user_id)')
            .eq('organization_participants.user_id', user.id);

        if (error) throw error;
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(req) {
    const { name } = await req.json();

    try {
        const user = await getUserData();
        const { data, error } = await supabaseBrowserClient
            .from('organizations')
            .insert([{ name, creator_id: user.id }])
            .select();

        if (error) throw error;

        console.log("data", data);

        // Agregar el creador como participante inicial
        await supabaseBrowserClient
            .from('organization_participants')
            .insert([{ organization_id: data[0].id, user_id: user.id }]);

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

