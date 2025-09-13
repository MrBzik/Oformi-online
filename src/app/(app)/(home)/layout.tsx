import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import {Navbar} from "@/app/(app)/(home)/navbar";
import {Footer} from "@/app/(app)/(home)/footer";
import {SearchFilters, SearchFiltersLoading} from "@/app/(app)/(home)/search-filters";
import {getQueryClient, trpc} from "@/trpc/server";
import {Suspense} from "react";
import {MainContainer} from "@/modules/shared/ui/components/main-container";


interface Props {
    children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.categories.getMany.queryOptions(),
    );

    return (
        <div className="bg-bg-secondary">
            <div className="max-w-(--breakpoint-2xl) mx-auto min-h-screen">
                <Navbar/>
                <MainContainer>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <Suspense fallback={<SearchFiltersLoading/>}>
                            <SearchFilters/>
                        </Suspense>
                    </HydrationBoundary>
                    {children}
                </MainContainer>
                <Footer/>
            </div>
        </div>
    )
}

export default Layout
