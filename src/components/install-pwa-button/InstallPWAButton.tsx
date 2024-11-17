"use client"

import React, { useEffect, useState } from 'react';
import { Button } from 'rsuite';

import styles from "./installPWAButton.module.scss";
import { usePathname } from 'next/navigation';

export default function InstallPWAButton() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowButton(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        (deferredPrompt as any).prompt();

        const choiceResult = await (deferredPrompt as any).userChoice;
        if (choiceResult.outcome === 'accepted') {
            console.info('PWA installation accepted');
        } else {
            console.info('PWA installation dismissed');
        }

        setShowButton(false);
        setDeferredPrompt(null);
    };

    const hideBanner = () => {
        setShowButton(false);
        sessionStorage.setItem("hideBanner", "true");
    }

    const pathname = usePathname();
    // TODO: split main layout
    if (pathname === "/login") return null;

    if (!showButton || sessionStorage.getItem("hideBanner") === "true") return null;

    return (
        <div className={styles.container}>
            <Button block appearance="ghost" onClick={handleInstallClick}>
                <b>Install app</b>
            </Button>

            <div className={styles.closeButton} onClick={hideBanner}>✕</div>
        </div>
    );
}
