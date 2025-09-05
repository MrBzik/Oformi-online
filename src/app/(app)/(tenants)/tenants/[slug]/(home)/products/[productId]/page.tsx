import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {ProductView, ProductViewLoading} from "@/modules/products/ui/views/product-view";
import {Suspense} from "react";

interface Props {
    params: Promise<{ productId: string; slug: string}>
}

const Page = async ({params}: Props) => {

    const { productId, slug} = await params;

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
                <ProductView productId={productId} tenantSlug={slug} />
            </Suspense>
        </HydrationBoundary>
    );
}

export default Page;