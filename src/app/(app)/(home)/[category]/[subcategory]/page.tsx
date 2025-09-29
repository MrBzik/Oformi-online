import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {loadProductFilters} from "@/modules/products/search-params";
import {ProductListView} from "@/modules/products/ui/views/product-list-view";
import type {SearchParams} from "nuqs/server";
import {DEFAULT_LIMIT_PRODUCTS} from "@/constants";

interface Props {
    params: Promise<{
        subcategory: string;
    }>,
    searchParams: Promise<SearchParams>
}

const Page = async ( {params, searchParams} : Props) => {

    const {subcategory} = await params;
    const filters = await loadProductFilters(searchParams)

    const queryClient = getQueryClient()
    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
        category: subcategory,
        ...filters,
        limit: DEFAULT_LIMIT_PRODUCTS,
    }))

    void queryClient.prefetchQuery(trpc.tags.getMany.queryOptions({
        category: subcategory
    }))

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductListView category={subcategory}/>
        </HydrationBoundary>
    );
}
export default Page;