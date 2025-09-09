import {Navbar, NavbarLoading} from "@/modules/shared/ui/components/navbar";
import {Footer} from "@/modules/shared/ui/components/footer";
import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {Suspense} from "react";
import {MainContainer} from "@/modules/shared/ui/components/main-container";

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
        <div className="min-h-screen flex flex-col bg-bg-secondary">
            <div className="max-w-(--breakpoint-2xl) mx-auto flex flex-col min-h-screen w-full">
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <Suspense fallback={<NavbarLoading/>}>
                        <Navbar tenantSlug={slug}/>
                    </Suspense>
                </HydrationBoundary>
                <MainContainer>
                    {children}
                </MainContainer>
                <Footer/>
            </div>
        </div>
    )
}

export default Layout