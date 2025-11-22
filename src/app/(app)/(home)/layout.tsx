import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import {Navbar} from "@/app/(app)/(home)/navbar";
import {Footer} from "@/app/(app)/(home)/footer";
import {getQueryClient, trpc} from "@/trpc/server";
import type {Metadata} from "next";
import {ChatsSidebar} from "@/modules/stream/ui/views/chats-sidebar";
import UserSyncWrapper from "@/components/UserSyncWrapper";
import {ErrorBoundary} from "react-error-boundary";
import {ErrorHandler} from "@/modules/stream/ui/components/error-handler";


interface Props {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: "Оформляй услуги онлайн",
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

const Layout = async ({ children }: Props) => {

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

    return (
        <div className="bg-bg-primary overflow-clip">
            <div className="max-w-(--breakpoint-2xl) mx-auto flex flex-col min-h-screen">
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <Navbar/>
                </HydrationBoundary>
                <div className="flex-1">
                    {children}
                </div>
                <Footer/>
                <ErrorBoundary fallback={<ErrorHandler/>}>
                    <ChatsSidebar/>
                </ErrorBoundary>

            </div>
        </div>
    )
}

export default Layout
