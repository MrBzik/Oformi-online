import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import {TRPCReactProvider} from "@/trpc/client";
import {Toaster} from "@/components/ui/sonner";
import {NuqsAdapter} from "nuqs/adapters/next/app";
import BottomNav from "@/modules/shared/ui/components/bottom-nav";
import {YandexMetricaProvider} from "next-yandex-metrica";
import {SheetProvider} from "@/lib/sheetContext";

const dmSans = DM_Sans({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://oformi.online"),
    title: "Оформляй услуги онлайн",
    keywords: "онлайн услуги, оформить онлайн, маркетплейс услуг, открыть онлайн, услуги по оформлению",
    description: "Все услуги в одном месте. Просто. Удобно. Онлайн",
    openGraph: {
        title: "Оформляй услуги онлайн",
        description: "Все услуги в одном месте. Просто. Удобно. Онлайн",
        type: "website",
        locale: "ru-RU",
        url: "https://oformi.online",
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
                <YandexMetricaProvider
                    tagID={104387626}
                    initParameters={{ clickmap: true, trackLinks: true, accurateTrackBounce: true }}
                    router="app"
                >
                    <SheetProvider>
                        {children}
                    </SheetProvider>
                </YandexMetricaProvider>
                <Toaster/>
                <BottomNav/>
            </TRPCReactProvider>
        </NuqsAdapter>
        </body>
        </html>
    );
}
