"use client"
import React, { useContext } from 'react'
import Link from 'next/link';
import { useIsFetching } from 'react-query';
import { AuthContext } from '@/providers/AuthProvider';

import styles from "./navbar.module.scss";
import { MdOutlineShoppingCart } from 'react-icons/md';
import { SubHeader } from './SubHeader';

export const Navbar = () => {
    const { user, isDemo, singOut } = useContext(AuthContext);

    const isFetching = useIsFetching();

    return (
        <div>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}> <MdOutlineShoppingCart /> Simple Cart</Link>

                <div className={styles.pages}>
                    {
                        !isDemo ? (
                            <>
                                <div className={styles.username}>{(user as any)?.user_metadata.name}</div>
                                <b onClick={singOut}>Logout</b>
                            </>
                        ) : <div className={styles.username} onClick={() => { localStorage.removeItem("isDemo"); window.location.href = "/" }}> <b>Quit Demo</b> </div>
                    }
                </div>

                {Boolean(isFetching) && (
                    <div className={styles.progressBar}>
                        <div className={styles.progressBarInner}></div>
                    </div>
                )}
            </div>
            {
                isDemo && <SubHeader text="Demo version - explore and test features freely!" />
            }
        </div>
    )
}
