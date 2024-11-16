"use client"

import React from 'react'
import Link from 'next/link';
import { useIsFetching } from 'react-query';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { SubHeader } from './SubHeader';
import { signOut, useSession } from 'next-auth/react';
import { isDemo } from '@/utils/demo';
import { usePathname } from 'next/navigation';

import styles from "./navbar.module.scss";

export const Navbar = () => {
    const isFetching = useIsFetching();

    const { data: session } = useSession();

    const pathname = usePathname();

    // TODO: split main layout
    if (pathname === "/login") return null;

    return (
        <div>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}> <MdOutlineShoppingCart /> Simple Cart</Link>

                <div className={styles.pages}>
                    {
                        !isDemo() ? (
                            <>
                                <div className={styles.username}>
                                    {session?.user?.name}
                                </div>
                                <b onClick={() => signOut()}>Logout</b>
                            </>
                        ) : <div className={styles.username} onClick={() => {
                            localStorage.removeItem("isDemo");
                            document.cookie = "demoUser=; path=/; max-age=0";
                            window.location.href = "/";
                        }}> <b>Quit Demo</b> </div>
                    }
                </div>

                {Boolean(isFetching) && (
                    <div className={styles.progressBar}>
                        <div className={styles.progressBarInner}></div>
                    </div>
                )}
            </div>
            {
                isDemo() && <SubHeader text="Demo version - explore and test features freely!" />
            }
        </div>
    )
}
