import { supabase } from '@/utils/supabeClient';
import { getSession } from 'next-auth/react';

export async function POST(request: any) {
  const session = await getSession({ req });
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { name, price, priority } = await request.json();
  const userId = session?.user.id;

  const { data, error } = await supabase
    .from('products')
    .insert([{ name, price, priority, user_id: userId }]);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ product: data }), { status: 200 });
}