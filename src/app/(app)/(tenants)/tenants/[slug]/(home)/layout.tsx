import {Navbar, NavbarLoading} from "@/modules/shared/ui/components/navbar";
import {Footer} from "@/modules/shared/ui/components/footer";
import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {Suspense} from "react";

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{slug: string}>
}

const Layout = async ({children, params} : LayoutProps) => {

    const {slug} = await params;
    const queryClient = getQueryClient()

    void queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({
        slug: slug
    }))

    return (
        <div className="min-h-screen flex flex-col bg-bg-secondary ">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<NavbarLoading/>}>
                    <Navbar tenantSlug={slug}/>
                </Suspense>
            </HydrationBoundary>
            <div className="flex-1 border-[2px] border-e-[4px] border-b-[4px] rounded-xl mx-12 bg-bg-primary">
                <div className="max-w-(--breakpoint-xl) mx-auto">
                    {children}
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Layout