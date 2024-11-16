import { supabaseBrowserClient } from "@/utils/supabeClient";
import NextAuth, { getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { v4 as uuidv4 } from 'uuid';

// export const handler = NextAuth({
//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID as string,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
//         })
//     ],
//     pages: {
//         signIn: "/login"
//     },
//     callbacks: {
//         async signIn({ user }) {

//             console.log("paramUser", user);

//             // Verifica si el usuario ya existe en Supabase
//             const { data: existingUser, error } = await supabaseBrowserClient
//                 .from("users_duplicate")
//                 .select("*")
//                 .eq("user_id", user.id)  // Usa el ID de usuario de NextAuth o un identificador único como email
//                 .single();

//             console.log("existingUser", existingUser)

//             if (error) {
//                 console.log("error looking for user", error);
//             }



//             if (!existingUser) {

//                 console.log("USER NOPT FOUIND CREATING")

//                 // Si el usuario no existe, créalo en la tabla "users" de Supabase
//                 const { error: insertError, data: createdUser } = await supabaseBrowserClient
//                     .from("users_duplicate")
//                     .insert([
//                         {
//                             id: uuidv4(), // Asigna el ID único del usuario
//                             user_id: user.id,
//                             email: user.email,
//                             full_name: user.name,
//                             avatar_url: user.image
//                         },
//                     ])
//                     .select('*')
//                     .single();

//                 console.log("createdUser", createdUser)

//                 if (insertError) {
//                     console.error("Error creating user in Supabase:", insertError);
//                     return false; // Falla la autenticación si ocurre un error al crear el usuario
//                 }
//             }

//             return true; // Continúa con la autenticación si todo es correcto
//         },
//         async jwt({ token, user }) {
//             // Agregar el `id` del usuario al token si es la primera vez que inicia sesión
//             if (user) {
//                 token.id = user.id;
//             }
//             return token;
//         },

//         async session({ session, token }) {
//             // Pasar el `id` del usuario al objeto session
//             if (token.id) {
//                 session.user.id = token.id;
//             }
//             return session;
//         },
//     },
// })

// export { handler as GET, handler as POST }


export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        })
    ],
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async signIn({ user }: any) {
            // Verifica si el usuario ya existe en Supabase
            const { data: existingUser, error } = await supabaseBrowserClient
                .from("users_duplicate")
                .select("*")
                .eq("user_id", user.id)  // Usa el ID de usuario de NextAuth o un identificador único como email
                .single();

            if (!existingUser) {
                // Si el usuario no existe, créalo
                const { error: insertError } = await supabaseBrowserClient
                    .from("users_duplicate")
                    .insert([
                        {
                            id: uuidv4(), // Genera un ID único para el usuario
                            user_id: user.id,
                            email: user.email,
                            full_name: user.name,
                            avatar_url: user.image
                        },
                    ])
                    .single();

                if (insertError) {
                    console.error("Error creating user in Supabase:", insertError);
                    return false; // Falla la autenticación
                }
            }

            return true;
        },

        session: ({ session, token }: any) => ({
            ...session,
            user: {
                ...session.user,
                id: token.sub,
            },
        }),
    },
}

const handler = NextAuth(authOptions);

export const getAuthSession = () => getServerSession(authOptions)

export { handler as GET, handler as POST }