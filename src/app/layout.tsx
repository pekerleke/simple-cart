import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'rsuite/dist/rsuite.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from "@/components/navbar/Navbar";
import { ToastContainer } from "react-toastify";
import InstallPWAButton from "@/components/install-pwa-button/InstallPWAButton";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "SimpleCart",
    description: "Manage sales in the simplest way",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
            </head>
            <body className={inter.className}>
                <Providers>
                    <Navbar />
                    <InstallPWAButton />
                    {children}
                </Providers>
                <ToastContainer position="bottom-center" />
            </body>
        </html>
    );
}
