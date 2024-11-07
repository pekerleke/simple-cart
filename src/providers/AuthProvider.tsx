import { User } from '@supabase/supabase-js';
import { supabaseBrowserClient } from '@/utils/supabeClient';
import { createContext, useEffect, useState } from 'react';
import Loader from '@/components/loader/Loader';
import { Login } from '@/components/login/Login';
import { intialDemoData } from '@/utils/getInitialDemoData';

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
    const [isDemo, setIsDemo] = useState<boolean>();

    const handleSignout = async () => {
        const { error } = await supabaseBrowserClient.auth.signOut();
        if (!error) setUser(undefined);
        setUser(undefined);
    };

    const handleChangeToDemo = () => {
        const demoOrganizations = localStorage.getItem("demoOrganizations");
        if (!demoOrganizations) {
            localStorage.setItem("demoOrganizations", JSON.stringify(intialDemoData))
        }
        localStorage.setItem("isDemo", "true");
        setIsDemo(true);
    }

    useEffect(() => {
        setIsDemo(JSON.parse(localStorage.getItem("isDemo") || "false"));

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
        changeToDemo: handleChangeToDemo,
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
                    (!user && !isDemo && !loading) ? <Login /> : children
                }
            </div>
        </AuthContext.Provider >
    )
}