"use client"

import {useTRPC} from "@/trpc/client";
import {useSuspenseInfiniteQuery} from "@tanstack/react-query";
import {useProductFilters} from "@/modules/products/hooks/use-product-filters";
import {ProductCard, ProductCardLoading} from "@/modules/products/ui/components/product-card";
import {DEFAULT_LIMIT_PRODUCTS} from "@/constants";
import {LoaderIcon} from "lucide-react";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import {cn} from "@/lib/utils";
import {NoProductView} from "@/modules/products/ui/components/no-product";

interface Props {
    category?: string;
    tenantSlug?: string;
    narrowView? : boolean;
    wideView?: boolean
}

export const ProductList = ({
    category,
    tenantSlug,
    narrowView,
    wideView
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
            limit: DEFAULT_LIMIT_PRODUCTS,
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
            <NoProductView>
                Услуги не найдены
            </NoProductView>
        )
    }

    return(
        <>
            <div className={cn("grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4",
                narrowView && "lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4",
                wideView && "xl:grid-cols-5"
                )}>
                {data?.pages.flatMap((page) => page.docs).map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
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

export const ProductListLoading = ({narrowView, wideView}: Props) => {
    return (
        <div className={cn("grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4",
            narrowView && "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3",
            wideView && "xl:grid-cols-5")}
        >
            {Array.from({length: wideView ? 5 : 4}).map((_, index) => (
                <ProductCardLoading key={index}/>
            ))}
        </div>
    )
}