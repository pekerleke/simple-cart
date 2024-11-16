"use client"

import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc";
import { MdOutlineShoppingCart } from "react-icons/md";
import { intialDemoData } from "@/utils/getInitialDemoData";
import { useSearchParams } from "next/navigation";

import styles from "./styles.module.scss";

export default function LoginPage() {

    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl')

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
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.presentation}>
                    <div className={styles.logoContainer}>
                        <MdOutlineShoppingCart />
                    </div>
                    <h3>Simple Cart</h3>
                    <span className={styles.loginMessage}>{"Choose how you'd like to continue with Simple Cart"}</span>
                </div>

                <div className={styles.loginButton} onClick={() => signIn("google", { callbackUrl: callbackUrl as string || '/' })}>
                    <FcGoogle /> Continue with Google
                </div>

                <div className={styles.demoContainer}>
                    Or try the app first

                    <div className={styles.demoButton} onClick={handleChangeToDemo}>
                        Try demo
                    </div>
                </div>
            </div>
        </div>
    )
}