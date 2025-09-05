import {getQueryClient, trpc} from "@/trpc/server";
import {DEFAULT_LIMIT_PRODUCTS} from "@/constants";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {cn} from "@/lib/utils";
import {Suspense} from "react";
import {ProductListLoading} from "@/modules/products/ui/components/product-list";
import {FavouredProductsList} from "@/modules/favourite/ui/views/FavouredProductsList";

export const dynamic = "force-dynamic";

const Page = async () => {

    const queryClient = getQueryClient()
    void queryClient.prefetchInfiniteQuery(trpc.favourite.getMany.infiniteQueryOptions({
        limit: DEFAULT_LIMIT_PRODUCTS
    }))

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="px-4 lg:px-12 py-8 gap-4">
                <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
                    <div className={cn("lg:col-span-6 xl:col-span-8",
                    )}>
                        <Suspense fallback={<ProductListLoading/>}>
                            <FavouredProductsList/>
                        </Suspense>
                    </div>
                </div>
            </div>
        </HydrationBoundary>
    );
}

export default Page