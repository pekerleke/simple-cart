import { ReactNode } from 'react';
import { Providers } from './providers';
import { Header } from './header';

import styles from "./styles.module.scss";

const InnerLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Header />
            <main className={styles.childrenContainer}>
                {children}
            </main>
        </>
    );
}

export default function OrganizationLayout({ children }: { children: ReactNode }) {
    return (
        <Providers>
            <InnerLayout>
                {children}
            </InnerLayout>
        </Providers>
    )
}