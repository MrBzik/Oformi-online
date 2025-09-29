"use client"

import {useTRPC} from "@/trpc/client";
import {useSuspenseInfiniteQuery} from "@tanstack/react-query";
import {DEFAULT_LIMIT_PRODUCTS} from "@/constants";
import {NoProductView} from "@/modules/products/ui/components/no-product";
import {cn} from "@/lib/utils";
import {ProductCard} from "@/modules/products/ui/components/product-card";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import {LoaderIcon} from "lucide-react";

export const FavouredProductsList = () => {

    const trpc = useTRPC();


    const {
        data,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage
    } = useSuspenseInfiniteQuery(trpc.favourite.getMany.infiniteQueryOptions(
        {
            limit: DEFAULT_LIMIT_PRODUCTS,
        },
        {
            getNextPageParam : (lastPage) => {
                return (lastPage?.docs?.length ?? 0) > 0 ? lastPage?.nextPage : undefined;
            }
        }
    ))


    if((data.pages?.[0]?.docs.length ?? 0) ===0){
        return (
            <NoProductView>
                В Избранном пока нет услуг либо вы не авторизованы
            </NoProductView>
        )
    }

    return(
        <>
            <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4",
            )}>
                {data.pages.flatMap((page) => page!.docs).map(product => (
                    <ProductCard
                        key={product.id}
                        product={product.product}
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