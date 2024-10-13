"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { Provider, User } from '@supabase/supabase-js';
// import { signIn, signOut, useSession } from 'next-auth/react';

import styles from "./navbar.module.scss";
import { supabaseBrowserClient } from '@/utils/supabeClient';

export const Navbar = () => {

    // const { data: session } = useSession();

    const [user, setUser] = useState<User>();


    async function socialAuth(provider: Provider) {
        // https://supabase.com/docs/guides/auth/server-side/oauth-with-pkce-flow-for-ssr
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
                {/* <Link href="/sales">Sales</Link>
                <Link href="/settings">Settings</Link> */}


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

                {/* {
          session ? (
            <>
              <div>{session?.user?.name}</div>
              <b onClick={() => signOut()}>Sign out</b>
            </>
          ) : (
            <div>
              <b onClick={() => signIn('google')}>Sign in with Google</b>
            </div>
          )
        } */}
            </div>
        </div>
    )
}
