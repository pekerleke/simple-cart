import React from 'react'
import { Provider } from '@supabase/supabase-js';
import { supabaseBrowserClient } from '@/utils/supabeClient';
import { RiSupabaseLine } from "react-icons/ri";

import styles from "./login.module.scss";

export const Login = () => {

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
            <h3>Simple Cart</h3>
            <br /><br /><br />
            <span className={styles.loginMessage}>Continuar con</span>
            <div className={styles.loginButton} onClick={() => socialAuth("google")}>
                Google + <RiSupabaseLine /> Supabase
            </div>
        </div>
    )
}
