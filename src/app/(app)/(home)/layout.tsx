import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import {Navbar} from "@/app/(app)/(home)/navbar";
import {Footer} from "@/app/(app)/(home)/footer";
import {SearchFilters, SearchFiltersLoading} from "@/app/(app)/(home)/search-filters";
import {getQueryClient, trpc} from "@/trpc/server";
import {Suspense} from "react";


interface Props {
    children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.categories.getMany.queryOptions(),
    );

    return (
        <div className="flex flex-col min-h-screen bg-bg-secondary">
            <Navbar/>
            <div className="flex-1 mx-8 border-[2px_4px_4px_2px] rounded-xl overflow-hidden bg-bg-primary">
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <Suspense fallback={<SearchFiltersLoading/>}>
                        <SearchFilters/>
                    </Suspense>
                </HydrationBoundary>
                {children}
            </div>
            <Footer/>
        </div>
    )
}

export default Layout
