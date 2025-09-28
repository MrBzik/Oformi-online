import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import {TRPCReactProvider} from "@/trpc/client";
import {Toaster} from "@/components/ui/sonner";
import {NuqsAdapter} from "nuqs/adapters/next/app";
import BottomNav from "@/modules/shared/ui/components/bottom-nav";
import Script from "next/script";

const dmSans = DM_Sans({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Оформляй услуги онлайн",
    description: "",
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
