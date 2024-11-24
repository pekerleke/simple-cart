"use client"

import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc";
import { MdOutlineShoppingCart } from "react-icons/md";
import { intialDemoData } from "@/utils/getInitialDemoData";
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react'
import { useTranslation } from "react-i18next";

import styles from "./styles.module.scss";

export const dynamic = 'force-dynamic';

const InnerLoginPage = () => {

    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl')
    const { t } = useTranslation();

    const handleChangeToDemo = () => {
        const demoOrganizations = localStorage.getItem("demoOrganizations");
        if (!demoOrganizations) {
            localStorage.setItem("demoOrganizations", JSON.stringify(intialDemoData))
        }
        localStorage.setItem("isDemo", "true");
        document.cookie = "demoUser=true; path=/; max-age=3600";
        window.location.href = "/";
    }

    return (
        <Suspense>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.presentation}>
                        <div className={styles.logoContainer}>
                            <MdOutlineShoppingCart />
                        </div>
                        <h3>Simple Cart</h3>
                        <span className={styles.loginMessage}>{t("login.message")}</span>
                    </div>

                    <div className={styles.loginButton} onClick={() => signIn("google", { callbackUrl: callbackUrl as string || '/' })}>
                        <FcGoogle /> {t("login.continueWithGoogle")}
                    </div>

                    <div className={styles.demoContainer}>
                        {t("login.demoMessage")}

                        <div className={styles.demoButton} onClick={handleChangeToDemo}>
                            {t("login.continueWithDemo")}
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    )
}

export default function LoginPage() {
    return (
        <Suspense>
            <InnerLoginPage />
        </Suspense>
    )
}