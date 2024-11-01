"use client"

import React, { useContext } from 'react'
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { OrganizationContext } from '@/providers/OrganizationProvider';
import { stringToColor } from '@/utils/stringToColor';
import classNames from 'classnames';

import styles from "./styles.module.scss";

export const Header = () => {
    const { organization: organizationId } = useParams();

    const pathname = usePathname();

    const { organization, status } = useContext(OrganizationContext);

    const avatarColors = stringToColor((organization as any)?.name || "");

    return (
        <header className={styles.header}>
            <Link className={styles.name} href={`/${organizationId}`}>
                {
                    status === "loading" ? (
                        <div className={styles.nameSkeleton}></div>
                    ) : (
                        <div className={styles.organization}>
                            <div className={styles.organizationAvatar} style={{ backgroundColor: avatarColors.pastel, color: avatarColors.contrast }}>
                                {(organization as any)?.name[0]}
                            </div>
                            <h3>{(organization as any)?.name}</h3>
                        </div>
                    )
                }
            </Link>
            <div>
                <div className={styles.navItems}>
                    <Link prefetch className={classNames(styles.link, { [styles.selected]: pathname.split("/")[2] === undefined })} href={`/${organizationId}`}>Cart</Link>
                    <Link prefetch className={classNames(styles.link, { [styles.selected]: pathname.split("/")[2] === "sales" })} href={`/${organizationId}/sales`}>Sales</Link>
                    <Link prefetch className={classNames(styles.link, { [styles.selected]: pathname.split("/")[2] === "settings" })} href={`/${organizationId}/settings`}>Settings</Link>
                </div>
            </div>
        </header>
    )
}
