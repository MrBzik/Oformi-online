import {caller, getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {ProductView, ProductViewLoading} from "@/modules/products/ui/views/product-view";
import {Suspense} from "react";
import {loadRefLink} from "@/modules/products/search-params";
import type {SearchParams} from "nuqs/server";
import {Metadata} from "next";
import {formatCurrency} from "@/lib/utils";
import {reviewCountToText} from "@/modules/utils/reviewsUtils";

interface Props {
    params: Promise<{ productId: string; slug: string}>,
    searchParams: Promise<SearchParams>
}

export async function generateMetadata({
    params
}: Props): Promise<Metadata> {

    const { productId} = await params;

    const product = await caller.products.getOneMeta({id: productId})

    return {
        title: product.name,
        description: `Оформи услугу онлайн | ${formatCurrency(product.price)} | ${reviewCountToText(product.ratingCount)}`
    }
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
    void queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({
        slug: slug
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

    void queryClient.prefetchInfiniteQuery(trpc.questions.getMany.infiniteQueryOptions({
        productId: productId
    }))

    void queryClient.prefetchQuery(trpc.questions.getWaitTime.queryOptions({
        productId: productId,
    }))

    void queryClient.prefetchQuery(trpc.tenants.getUser.queryOptions({
        slug: slug
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