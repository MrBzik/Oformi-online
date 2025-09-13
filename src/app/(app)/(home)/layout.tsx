import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import {Navbar} from "@/app/(app)/(home)/navbar";
import {Footer} from "@/app/(app)/(home)/footer";
import {getQueryClient, trpc} from "@/trpc/server";


interface Props {
    children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.categories.getMany.queryOptions(),
    );

    return (
        <div className="bg-bg-primary">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Navbar/>
            </HydrationBoundary>
            <div className="max-w-(--breakpoint-2xl) mx-auto min-h-screen flex flex-col">
                <div className="flex-1">
                    {children}
                </div>
                <Footer/>
            </div>
        </div>
    )
}

export default Layout
