import { User } from '@supabase/supabase-js';
import { supabaseBrowserClient } from '@/utils/supabeClient';
import { createContext, useEffect, useState } from 'react';
import Loader from '@/components/loader/Loader';
import { Login } from '@/components/login/Login';

export const AuthContext = createContext({
    user: null,
    isDemo: false,
    singOut: () => { },
    changeToDemo: () => { },
    loading: false
});

export const AuthProvider = ({ children }: any) => {

    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(true);
    const [isDemo, setIsDemo] = useState(false);

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
        isDemo,
        singOut: handleSignout,
        changeToDemo: () => setIsDemo(true),
        loading
    }

    if (loading) {
        return (
            <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Loader />
            </div>
        )
    }

    return (
        <AuthContext.Provider value={context as any} >
            <div>
                {
                    (!user && !isDemo && !loading) ? (
                        <div>
                            {/* <button onClick={() => setIsDemo(true)}>Demo</button>
                            <br /> */}
                            <Login />
                        </div>
                    ) : children
                }
            </div>
        </AuthContext.Provider >
    )
}