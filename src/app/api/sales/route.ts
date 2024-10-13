import getUserData from "@/actions/getUserData";
import { supabaseBrowserClient } from "@/utils/supabeClient";
import { NextResponse } from "next/server";

export async function GET(req) {
    const user = await getUserData();

    try {
        const { data, error } = await supabaseBrowserClient
            .from('sales')
            .select('*')
            .eq('user_id', user.id);

        if (error) throw error;
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(req) {
    const { products } = await req.json();

    const user = await getUserData();

    try {
        const { data, error } = await supabaseBrowserClient
            .from('sales')
            .insert([{ products, user_id: user.id }]);

        if (error) throw error;
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}