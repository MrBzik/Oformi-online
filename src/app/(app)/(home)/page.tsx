import type {SearchParams} from "nuqs/server"
import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {loadProductFilters} from "@/modules/products/search-params";
import {ProductListView} from "@/modules/products/ui/views/product-list-view";
import {DEFAULT_LIMIT_PRODUCTS} from "@/constants";

interface Props {
    searchParams: Promise<SearchParams>
}

const Page = async ( {searchParams} : Props) => {

    const filters = await loadProductFilters(searchParams)

    const queryClient = getQueryClient()
    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
        ...filters,
        limit: DEFAULT_LIMIT_PRODUCTS
    }))

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductListView category={filters.category}/>
        </HydrationBoundary>
    );
}

export default Page;