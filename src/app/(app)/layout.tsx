import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import {TRPCReactProvider} from "@/trpc/client";
import {Toaster} from "@/components/ui/sonner";
import {NuqsAdapter} from "nuqs/adapters/next/app";
import BottomNav from "@/modules/shared/ui/components/bottom-nav";

const dmSans = DM_Sans({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
    title: "Оформляй услуги онлайн",
    keywords: "онлайн услуги, оформить онлайн",
    description: "Все услуги в одном месте. Просто. Удобно. Онлайн",
    openGraph: {
        title: "Оформляй услуги онлайн",
        description: "Все услуги в одном месте. Просто. Удобно. Онлайн",
        type: "website",
        locale: "ru-RU",
        url: process.env.NEXT_PUBLIC_APP_URL,
        siteName: "Оформи Онлайн"
    }

};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru" className="scroll-smooth">
        <body
            className={`${dmSans.className} antialiased`}
        >
        <NuqsAdapter>
            <TRPCReactProvider>
                {children}
                <Toaster/>
                <BottomNav/>
            </TRPCReactProvider>
        </NuqsAdapter>
        </body>
        </html>
    );
}
