"use client"

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'rsuite/dist/rsuite.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from "@/components/navbar/Navbar";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//     title: "SimpleCart",
//     description: "Manage sales in the simplest way",
// };

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <head><meta name="viewport" content="width=device-width, user-scalable=no" /> </head>
            <body className={inter.className}>
                <SessionProvider>
                    <Navbar />
                    <div style={{ padding: 10 }}>
                        {children}
                    </div>
                    <ToastContainer position="bottom-center" />
                </SessionProvider>
            </body>
        </html>
    );
}
