import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'rsuite/dist/rsuite.min.css';
import { Navbar } from "@/components/navbar/Navbar";

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
            <body className={inter.className}>
                <Navbar />
                <div style={{padding: 10}}>
                    {children}
                </div>
            </body>
        </html>
    );
}
