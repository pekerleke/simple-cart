"use client"

import React, { useContext } from 'react'
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { OrganizationContext } from '@/providers/OrganizationProvider';
import { stringToColor } from '@/utils/stringToColor';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import styles from "./styles.module.scss";

export const Header = () => {
    const { organization: organizationId } = useParams();

    const pathname = usePathname();
    const { t: translate } = useTranslation();

    const { organization, status } = useContext(OrganizationContext);

    const avatarColors = stringToColor((organization as any)?.name || "");

    return (
        <header className={styles.header}>
            <Link className={styles.name} href={`/organization/${organizationId}`}>
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
                    <Link prefetch className={classNames(styles.link, { [styles.selected]: pathname.split("/")[3] === undefined })} href={`/organization/${organizationId}`}>{translate("cart")}</Link>
                    <Link prefetch className={classNames(styles.link, { [styles.selected]: pathname.split("/")[3] === "sales" })} href={`/organization/${organizationId}/sales`}>{translate("sales")}</Link>
                    <Link prefetch className={classNames(styles.link, { [styles.selected]: pathname.split("/")[3] === "settings" })} href={`/organization/${organizationId}/settings`}>{translate("settings")}</Link>
                </div>
            </div>
        </header>
    )
}
