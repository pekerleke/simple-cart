"use client"

import { ReactNode, useContext } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import classNames from 'classnames';
import { OrganizationContext, OrganizationProvider } from '@/providers/OrganizationProvider';
import { stringToColor } from '@/utils/stringToColor';

import styles from "./styles.module.scss";

const InnerLayout = ({ children }: { children: ReactNode }) => {
    const { organization: organizationId } = useParams();

    const pathname = usePathname();

    const { organization, status } = useContext(OrganizationContext);

    const avatarColors = stringToColor((organization as any)?.name || "");

    return (
        <div>
            <header className={styles.header}>
                <Link className={styles.name} href={`/${organizationId}`}>
                    {
                        status === "loading" ? (
                            <div className={styles.nameSkeleton}></div>
                        ) : (
                            <div className={styles.organization}>
                                <div className={styles.organizationAvatar} style={{backgroundColor: avatarColors.pastel, color: avatarColors.contrast}}>
                                    {(organization as any)?.name[0]}
                                </div>
                                <h3>{(organization as any)?.name}</h3>
                            </div>
                        )
                    }
                </Link>
                <div className={styles.navItems}>
                    <Link className={classNames(styles.link, { [styles.selected]: pathname.split("/")[2] === undefined })} href={`/${organizationId}`}>Cart</Link>
                    <Link className={classNames(styles.link, { [styles.selected]: pathname.split("/")[2] === "sales" })} href={`/${organizationId}/sales`}>Sales</Link>
                    <Link className={classNames(styles.link, { [styles.selected]: pathname.split("/")[2] === "settings" })} href={`/${organizationId}/settings`}>Settings</Link>
                </div>
            </header>
            <main className={styles.childrenContainer}>
                {children}
            </main>
        </div>
    );
}

export default function OrganizationLayout({ children }: { children: ReactNode }) {
    return (
        <OrganizationProvider>
            <InnerLayout>
                {children}
            </InnerLayout>
        </OrganizationProvider>
    )
}