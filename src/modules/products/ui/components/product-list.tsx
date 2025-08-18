"use client"

import {useTRPC} from "@/trpc/client";
import {useSuspenseInfiniteQuery} from "@tanstack/react-query";
import {useProductFilters} from "@/modules/products/hooks/use-product-filters";
import {ProductCard, ProductCardLoading} from "@/modules/products/ui/components/product-card";
import {DEFAULT_LIMIT} from "@/constants";
import {InboxIcon, LoaderIcon} from "lucide-react";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import {cn} from "@/lib/utils";

interface Props {
    category?: string;
    tenantSlug?: string;
    narrowView? : boolean;
}

export const ProductList = ({
    category,
    tenantSlug,
    narrowView,
} : Props) => {

    const [filers] = useProductFilters();

    const trpc = useTRPC();
    const {
        data,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useSuspenseInfiniteQuery(trpc.products.getMany.infiniteQueryOptions(
        {
            limit: DEFAULT_LIMIT,
            category: category,
            tenantSlug: tenantSlug,
            ...filers
        },
        {
            getNextPageParam : (lastPage) => {
                return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
            }
        }
    ))

    if(data.pages?.[0]?.docs.length ===0){
        return (
            <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
                <InboxIcon/>
                <p className="text-base font-medium">Услуги не найдены</p>
            </div>
        )
    }

    return(
        <>
            <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4",
                narrowView && "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3",)}>
                {data?.pages.flatMap((page) => page.docs).map(product => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        imageUrl={product.image?.url}
                        tenantSlug={product.tenant.slug}
                        tenantImageUrl={product.tenant.image?.url}
                        reviewRating={5}
                        reviewCount={5}
                        price={product.price}/>
                ))}

            </div>
            <div className="flex w-full justify-center">
                <InfiniteScroll isLoading={isFetchingNextPage} hasMore={hasNextPage} next={fetchNextPage}>
                    {hasNextPage && <LoaderIcon className="my-14 h-8 w-8 animate-spin" />}
                </InfiniteScroll>
            </div>
        </>
    )
}

export const ProductListLoading = ({narrowView}: Props) => {
    return (
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4",
            narrowView && "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3",)}>
            {Array.from({length: DEFAULT_LIMIT}).map((_, index) => (
                <ProductCardLoading key={index}/>
            ))}
        </div>
    )
}