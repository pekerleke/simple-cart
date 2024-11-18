import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";
import 'rsuite/dist/rsuite.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from "@/components/navbar/Navbar";
import { ToastContainer } from "react-toastify";
import InstallPWAButton from "@/components/install-pwa-button/InstallPWAButton";
import { Providers } from "./providers";

// TODO: load font locally
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "SimpleCart",
    description: "Manage sales in the simplest way",
    openGraph: {
        title: "SimpleCart",
        description: "Manage sales in the simplest way",
        url: "https://simple-cart-ruddy.vercel.app",
        siteName: "SimpleCart",
        images: [
            {
                url: "https://simple-cart-ruddy.vercel.app/cover.jpg",
                width: 1200,
                height: 630,
                alt: "SimpleCart - Manage sales in the simplest way",
            },
        ],
        locale: "en_US",
        type: "website",
    },
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
            <body className={inter.className} style={{ backgroundColor: "#f9fafb" }}>
                <Providers>
                    <Navbar />
                    <InstallPWAButton />
                    {children}
                </Providers>
                <ToastContainer position="bottom-center" />
                <Analytics />
            </body>
        </html>
    );
}
