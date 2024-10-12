import { supabase } from "@/utils/supabeClient";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";

// export async function GET(request) {
//     const session = await getSession({ req });
//     if (!session) return new Response('Unauthorized', { status: 401 });
  
//     const { data, error } = await supabase
//       .from('products')
//       .select('*')
//       .eq('user_id', session.user.id);
  
//     if (error) {
//       return new Response(JSON.stringify({ error: error.message }), { status: 400 });
//     }
  
//     return new Response(JSON.stringify({ products: data }), { status: 200 });
//   }

export async function GET(request: any) {
  const session = await getSession();
  console.log(session);
  const token = await getToken({ req: request });

  console.log(token);

  if (!token) return new Response('Unauthorized', { status: 401 });

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', token.sub); // asumiendo que `sub` es el user ID

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ products: data }), { status: 200 });
}