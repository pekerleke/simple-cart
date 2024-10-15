import { Provider, User } from '@supabase/supabase-js';
import { supabaseBrowserClient } from '@/utils/supabeClient';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext({
    user: null,
    loading: false
});

export const AuthProvider = ({ children }: any) => {

    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(true);

    async function socialAuth(provider: Provider) {
        const currentPath = location.pathname;
        await supabaseBrowserClient.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${location.origin}/auth/callback?next=${currentPath}`,
            },
        });
    }

    useEffect(() => {
        const getCurrUser = async () => {
            const {
                data: { session },
            } = await supabaseBrowserClient.auth.getSession();

            if (session) {
                setUser(session.user);
            } else {
                console.log("no user");
            }
            setLoading(false);
        };

        getCurrUser();
    }, []);

    const context = {
        user,
        loading
    }

    return (
        <AuthContext.Provider value={context as any} >
            <div>
                {
                    (!user && !loading) ? (
                        <b onClick={() => socialAuth("google")}>Login</b>
                    ) : children
                }
            </div>
        </AuthContext.Provider >
    )
}