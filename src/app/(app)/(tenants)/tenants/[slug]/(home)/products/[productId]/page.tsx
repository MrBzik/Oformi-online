import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {ProductView, ProductViewLoading} from "@/modules/products/ui/views/product-view";
import {Suspense} from "react";
import {loadRefLink} from "@/modules/products/search-params";
import type {SearchParams} from "nuqs/server";

interface Props {
    params: Promise<{ productId: string; slug: string}>,
    searchParams: Promise<SearchParams>
}

const Page = async ({
    params, searchParams
}: Props) => {

    const { productId, slug} = await params;
    const refParams = await loadRefLink(searchParams)

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.products.getOne.queryOptions({
        id: productId,
    }))

    void queryClient.prefetchQuery(trpc.orders.getOne.queryOptions({
        productId: productId,
    }))

    void queryClient.prefetchQuery(trpc.favourite.getOne.queryOptions({
        productId: productId
    }))

    void queryClient.prefetchQuery(trpc.auth.session.queryOptions())

    void queryClient.prefetchQuery(trpc.reviews.getOne.queryOptions({
        productId: productId,
    }))

    void queryClient.prefetchInfiniteQuery(trpc.reviews.getMany.infiniteQueryOptions({
        productId: productId
    }))

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<ProductViewLoading/>}>
                <ProductView productId={productId} tenantSlug={slug} refLink={refParams.ref} />
            </Suspense>
        </HydrationBoundary>
    );
}

export default Page;