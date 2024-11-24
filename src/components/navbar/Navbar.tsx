"use client"

import React, { useState } from 'react'
import Link from 'next/link';
import { useIsFetching } from 'react-query';
import { MdClose, MdOutlineShoppingCart } from 'react-icons/md';
import { SubHeader } from './SubHeader';
import { signOut, useSession } from 'next-auth/react';
import { isDemo } from '@/utils/demo';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { HiMenu } from 'react-icons/hi';
import LanguageSelector from '../language-selector/LanguageSelector';
import { useClickOutside } from '@/hooks/useClickOutside';

import styles from "./navbar.module.scss";

export const Navbar = () => {
    const isFetching = useIsFetching();

    const pathname = usePathname();
    const { t: translate } = useTranslation();

    const [showMenu, setShowMenu] = useState(false);

    // TODO: split main layout
    if (pathname === "/login") return null;

    return (
        <div>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}> <MdOutlineShoppingCart /> Simple Cart</Link>

                <div style={{ position: "relative" }}>
                    {
                        !showMenu
                            ? <HiMenu size={24} onClick={() => setShowMenu(prev => !prev)} />
                            : <MdClose size={24} onClick={() => setShowMenu(prev => !prev)} />
                    }

                    {
                        showMenu && <Menu onClose={() => setShowMenu(false)} />
                    }
                </div>

                {Boolean(isFetching) && (
                    <div className={styles.progressBar}>
                        <div className={styles.progressBarInner}></div>
                    </div>
                )}
            </div>
            {
                isDemo() && <SubHeader text={translate("demoAdvice")} />
            }
        </div>
    )
}

interface MenuProps {
    onClose: () => void
}

const Menu = (props: MenuProps) => {

    const { onClose } = props;

    const { ref } = useClickOutside(onClose);

    const { t: translate } = useTranslation();


    const { data: session } = useSession();

    return (
        <div ref={ref} className={styles.menuContainer}>
            <div className={styles.userInfo}>
                {
                    !isDemo() ? (
                        <>
                            <div className={styles.username}>{session?.user?.name}</div>
                            <div className={styles.email}>{session?.user?.email}</div>
                        </>
                    ) : (
                        <div className={styles.username}>Demo</div>
                    )
                }
            </div>
            <hr />
            <LanguageSelector />
            <hr />

            {
                !isDemo() ? <b onClick={() => signOut()}>{translate("logout")}</b> : <div className={styles.username} onClick={() => {
                    localStorage.removeItem("isDemo");
                    document.cookie = "demoUser=; path=/; max-age=0";
                    window.location.href = "/";
                }}> <b>{translate("quitDemo")}</b> </div>
            }

        </div>
    )
}