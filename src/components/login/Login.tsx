import React, { useContext } from 'react'
import { Provider } from '@supabase/supabase-js';
import { supabaseBrowserClient } from '@/utils/supabeClient';
import { RiSupabaseLine } from "react-icons/ri";

import styles from "./login.module.scss";
import { AuthContext } from '@/providers/AuthProvider';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';

export const Login = () => {

    const { changeToDemo } = useContext(AuthContext);

    async function socialAuth(provider: Provider) {
        const currentPath = location.pathname;
        await supabaseBrowserClient.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${location.origin}/auth/callback?next=${currentPath}${location.search}`,
            },
        });
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.presentation}>
                    <div className={styles.logoContainer}>
                        <MdOutlineShoppingCart />
                    </div>
                    <h3>Simple Cart</h3>
                    <span className={styles.loginMessage}>{"Choose how you'd like to continue with Simple Cart"}</span>
                </div>

                <div className={styles.loginButton} onClick={() => socialAuth("google")}>
                    <FcGoogle /> Continue with Google
                    {/* + <RiSupabaseLine /> Supabase */}
                </div>

                <div className={styles.demoContainer}>
                    Or try the app first

                    <div className={styles.demoButton} onClick={changeToDemo}>
                        Try demo
                    </div>
                </div>
            </div>
        </div>
    )
}
