import { supabaseBrowserClient } from "@/utils/supabeClient";
import GoogleProvider from "next-auth/providers/google";
import { v4 as uuidv4 } from 'uuid';

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
                .from("users")
                .select("*")
                .eq("user_id", user.id)  // Usa el ID de usuario de NextAuth o un identificador único como email
                .single();

            if (!existingUser) {
                const { error: insertError } = await supabaseBrowserClient
                    .from("users")
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

                    // TODO: quitar despues de la migracion total
                    if (insertError.code === "23505") {
                        const { data, error } = await supabaseBrowserClient
                            .from('users')
                            .update({ user_id: user.id })
                            .eq('email', user.email);

                        if (error) throw error;

                        return true;
                    }

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