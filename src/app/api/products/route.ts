import getUserData from "@/actions/getUserData";
import { supabaseBrowserClient } from "@/utils/supabeClient";
import { NextResponse } from "next/server";

export async function GET(req) {
    // const { searchParams } = new URL(req.url);
    // const userId = searchParams.get('user_id');

    // if (!userId) {
    //   return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    // }

    const user = await getUserData();

    console.log(user);

    try {
        const { data, error } = await supabaseBrowserClient
            .from('products')
            .select('*')
            .eq('user_id', user.id);

        if (error) throw error;
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(req) {
    const { name, price, priority, user_id } = await req.json();

    const user = await getUserData();

    try {
        const { data, error } = await supabaseBrowserClient
            .from('products')
            .insert([{ name, price, priority, user_id: user.id }]);

        if (error) throw error;
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function PATCH(req) {
    const { id, name, price, priority } = await req.json();

    try {
        const { data, error } = await supabaseBrowserClient
            .from('products')
            .update({ name, price, priority })
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(req) {
    const { id } = await req.json();
    try {
        const { data, error } = await supabaseBrowserClient
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}