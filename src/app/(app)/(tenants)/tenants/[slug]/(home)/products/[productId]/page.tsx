import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary, useSuspenseQuery} from "@tanstack/react-query";
import {ProductView} from "@/modules/products/ui/views/product-view";

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

    void queryClient.prefetchQuery(trpc.auth.session.queryOptions())

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductView productId={productId} tenantSlug={slug} />
        </HydrationBoundary>
    );
}

export default Page;