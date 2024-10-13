"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { Provider, User } from '@supabase/supabase-js';
import { supabaseBrowserClient } from '@/utils/supabeClient';
import { useIsFetching } from 'react-query';

import styles from "./navbar.module.scss";

export const Navbar = () => {
    const [user, setUser] = useState<User>();

    const isFetching = useIsFetching();

    async function socialAuth(provider: Provider) {
        await supabaseBrowserClient.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
    }

    const handleSignout = async () => {
        const { error } = await supabaseBrowserClient.auth.signOut();
        if (!error) setUser(undefined);
    };

    useEffect(() => {
        const getCurrUser = async () => {
            const {
                data: { session },
            } = await supabaseBrowserClient.auth.getSession();

            if (session) {
                setUser(session.user);
            }
        };

        getCurrUser();
    }, []);

    return (
        <div className={styles.container}>
            <Link href="/" className={styles.logo}>Simple Cart</Link>

            <div className={styles.pages}>
                {
                    user ? (
                        <>
                            <b>{user.user_metadata.name}</b>
                            <b onClick={handleSignout}>Logout</b>
                        </>
                    ) : (
                        <b onClick={() => socialAuth("google")}>Login</b>
                    )
                }
            </div>

            {Boolean(isFetching) && (
                <div className={styles.progressBar}>
                    <div className={styles.progressBarInner}></div>
                </div>
            )}
        </div>
    )
}
