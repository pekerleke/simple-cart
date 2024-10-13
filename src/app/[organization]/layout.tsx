"use client"

import { createContext, ReactNode } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from 'react-query';
import classNames from 'classnames';

import styles from "./styles.module.scss";
import { OrganizationProvider } from '@/providers/OrganizationProvider';

// export const OrganizationContext = createContext({
//     organization: null,
//     status: "",
//     refetch: () => { }
// });

export default function OrganizationLayout({ children }: { children: ReactNode }) {
    const { organization: organizationId } = useParams();

    const pathname = usePathname();

    const { data, status, refetch } = useQuery({
        queryKey: [organizationId],
        queryFn: () => fetch(`/api/organizations/${organizationId}`)
            .then(res => res.json())
            .then(data => data.organization)
            .catch(err => console.error(err)),
    })

    // const context = {
    //     organization: data,
    //     status,
    //     refetch
    // }

    return (
        // <OrganizationContext.Provider value={context}>
        <OrganizationProvider>
            <header className={styles.header}>
                <Link className={styles.name} href={`/${organizationId}`}>
                    {
                        status === "loading" ? (
                            <div className={styles.nameSkeleton}></div>
                        ) : (
                            <h3>{data?.name}</h3>
                        )
                    }
                </Link>
                <div style={{ display: "flex", gap: 10 }}>
                    <Link className={classNames(styles.link, { [styles.selected]: pathname.split("/")[2] === undefined })} href={`/${organizationId}`}>Cart</Link>
                    <Link className={classNames(styles.link, { [styles.selected]: pathname.split("/")[2] === "sales" })} href={`/${organizationId}/sales`}>Sales</Link>
                    <Link className={classNames(styles.link, { [styles.selected]: pathname.split("/")[2] === "settings" })} href={`/${organizationId}/settings`}>Settings</Link>
                </div>
            </header>
            <main style={{ padding: 10 }}>{children}</main>
        </OrganizationProvider>
        // </OrganizationContext.Provider >
    );
}