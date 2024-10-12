import { supabase } from '@/utils/supabeClient';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: "388123913424-k72c30umku294khlr7fvtga4t3krvsog.apps.googleusercontent.com",
            clientSecret: "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",
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            try {
                // TODO: habilitar SRL en supabase
                const { data, error } = await supabase
                    .from('users')
                    .upsert([{
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.image,
                    }]);

                if (error) {
                    console.error("Error syncing user with Supabase:", error);
                    return false;
                }

                return true;
            } catch (err) {
                console.error("Unexpected error syncing with Supabase:", err);
                return false;
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;  // Almacena el `user.id` en el token
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;  // Pasa el `user.id` a la sesión
            }
            return session;
        }
        // async signIn({ user }) {
        //   // Sincroniza el usuario con Supabase después del login
        //   const { data, error } = await supabase
        //     .from('users')
        //     .upsert([{ 
        //       id: user.id, 
        //       email: user.email,
        //       name: user.name,
        //       image: user.image,
        //     }]);

        //   if (error) {
        //     console.error("Error syncing user with Supabase:", error);
        //     return false;  // Cancela el login si hay un error
        //   }

        //   return true; // Permite el login
        // },
        // async session({ session, token }) {
        //   session.user = token.user;
        //   return session;
        // },
        // async jwt({ token, user }) {
        //   if (user) {
        //     token.user = user;
        //   }
        //   return token;
        // }
    }
});

export { handler as GET, handler as POST };



// https://kfzxgxuhjkpplaihvkqo.supabase.co/auth/v1/callback