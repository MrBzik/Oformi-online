import type {SearchParams} from "nuqs/server"
import {loadProductFilters} from "@/modules/products/search-params";
import {getQueryClient, trpc} from "@/trpc/server";
import {DEFAULT_LIMIT_PRODUCTS} from "@/constants";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {ProductListView} from "@/modules/products/ui/views/product-list-view";

interface Props {
    searchParams: Promise<SearchParams>,
    params: Promise<{ slug: string} >
}

const Page = async ({
    searchParams,
    params,
} : Props ) => {
    const {slug} = await params;
    const filters = await loadProductFilters(searchParams)

    const queryClient = getQueryClient()
    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
        tenantSlug: slug,
        ...filters,
        limit: DEFAULT_LIMIT_PRODUCTS
    }))

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductListView tenantSlug={slug} narrowView/>
        </HydrationBoundary>
    );
}

export default Page