"use client"
import React, { useContext } from 'react'
import Link from 'next/link';
import { useIsFetching } from 'react-query';
import { FaCartShopping } from "react-icons/fa6";
import { AuthContext } from '@/providers/AuthProvider';

import styles from "./navbar.module.scss";

export const Navbar = () => {
    const { user, singOut } = useContext(AuthContext);

    const isFetching = useIsFetching();

    return (
        <div className={styles.container}>
            <Link href="/" className={styles.logo}> <FaCartShopping /> Simple Cart</Link>

            <div className={styles.pages}>
                <b>{(user as any).user_metadata.name}</b>
                <b onClick={singOut}>Logout</b>
            </div>

            {Boolean(isFetching) && (
                <div className={styles.progressBar}>
                    <div className={styles.progressBarInner}></div>
                </div>
            )}
        </div>
    )
}
