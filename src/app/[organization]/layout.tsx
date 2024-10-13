"use client"

import { ReactNode, useContext } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import classNames from 'classnames';
import { OrganizationContext, OrganizationProvider } from '@/providers/OrganizationProvider';

import styles from "./styles.module.scss";
import { stringToColor } from '@/utils/stringToColor';

const InnerLayout = ({ children }: { children: ReactNode }) => {
    const { organization: organizationId } = useParams();

    const pathname = usePathname();

    const { organization, status } = useContext(OrganizationContext);

    const avatarColors = stringToColor((organization as any)?.name || "");

    console.log(avatarColors);

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
                <div style={{ display: "flex", gap: 10 }}>
                    <Link className={classNames(styles.link, { [styles.selected]: pathname.split("/")[2] === undefined })} href={`/${organizationId}`}>Cart</Link>
                    <Link className={classNames(styles.link, { [styles.selected]: pathname.split("/")[2] === "sales" })} href={`/${organizationId}/sales`}>Sales</Link>
                    <Link className={classNames(styles.link, { [styles.selected]: pathname.split("/")[2] === "settings" })} href={`/${organizationId}/settings`}>Settings</Link>
                </div>
            </header>
            <main style={{ padding: 10, maxWidth: 1024, margin: "auto" }}>{children}</main>
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