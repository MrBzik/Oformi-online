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
        <Script
            id="yandex-metrica"
            strategy="afterInteractive" // ensures it runs after hydration
            dangerouslySetInnerHTML={{
                __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=104387626', 'ym');

              ym(104387626, 'init', {ssr:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
            `,
            }}
        />
        <noscript>
            <div>
                <img
                    src="https://mc.yandex.ru/watch/104387626"
                    style={{ position: 'absolute', left: '-9999px' }}
                    alt=""
                />
            </div>
        </noscript>
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
