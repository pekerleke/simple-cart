"use client"
import React from 'react'
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

import styles from "./navbar.module.scss";

export const Navbar = () => {

  const { data: session } = useSession();

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>Simple Cart</Link>

      <div className={styles.pages}>
        <Link href="/sales">Sales</Link>
        <Link href="/settings">Settings</Link>

        {
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
        }
      </div>
    </div>
  )
}
