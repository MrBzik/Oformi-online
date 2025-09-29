import type {SearchParams} from "nuqs/server"
import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {loadProductFilters} from "@/modules/products/search-params";
import {ProductListView} from "@/modules/products/ui/views/product-list-view";
import {DEFAULT_LIMIT_PRODUCTS} from "@/constants";

interface Props {
    params: Promise<{
        category: string;
    }>,
    searchParams: Promise<SearchParams>
}

const Page = async ( {params, searchParams} : Props) => {

    const {category} = await params;
    const filters = await loadProductFilters(searchParams)

    const queryClient = getQueryClient()
    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
        category: category,
        ...filters,
        limit: DEFAULT_LIMIT_PRODUCTS
    }))

    void queryClient.prefetchQuery(trpc.tags.getMany.queryOptions({
        category: category
    }))

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductListView category={category}/>
        </HydrationBoundary>
    );
}

export default Page;