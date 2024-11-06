"use client"
import React, { useContext } from 'react'
import Link from 'next/link';
import { useIsFetching } from 'react-query';
import { AuthContext } from '@/providers/AuthProvider';

import styles from "./navbar.module.scss";
import { MdOutlineShoppingCart } from 'react-icons/md';

export const Navbar = () => {
    const { user, isDemo, singOut } = useContext(AuthContext);

    const isFetching = useIsFetching();

    return (
        <div className={styles.container}>
            <Link href="/" className={styles.logo}> <MdOutlineShoppingCart /> Simple Cart {isDemo && <i>DEMO</i>}</Link>

            <div className={styles.pages}>
                {
                    !isDemo ? (
                        <>
                            <div className={styles.username}>{(user as any)?.user_metadata.name}</div>
                            <b onClick={singOut}>Logout</b>
                        </>
                    ) : <div className={styles.username}>DEMO</div>
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
