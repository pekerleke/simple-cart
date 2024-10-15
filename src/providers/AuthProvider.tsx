import { Provider, User } from '@supabase/supabase-js';
import { supabaseBrowserClient } from '@/utils/supabeClient';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext({
    user: null,
    singOut: () => {},
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

    const handleSignout = async () => {
        const { error } = await supabaseBrowserClient.auth.signOut();
        if (!error) setUser(undefined);
        setUser(undefined);
    };


    useEffect(() => {
        const getCurrUser = async () => {
            const {
                data: { session },
            } = await supabaseBrowserClient.auth.getSession();

            if (session) {
                setUser(session.user);
            }
            
            setLoading(false);
        };

        getCurrUser();
    }, []);

    const context = {
        user,
        singOut: handleSignout,
        loading
    }

    if (loading) {
        return (
            <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <b onClick={() => socialAuth("google")}>Loading</b>
            </div>
        )
    }

    return (
        <AuthContext.Provider value={context as any} >
            <div>
                {
                    (!user && !loading) ? (
                        <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <b onClick={() => socialAuth("google")}>Login</b>
                        </div>
                    ) : children
                }
            </div>
        </AuthContext.Provider >
    )
}