"use client";

import {Categories} from "./categories";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {DEFAULT_BG_COLOR} from "@/modules/home/constants";
import {useCategoryFilters} from "@/modules/products/hooks/use-product-filters";

export const SearchFilters = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

    const [filters] = useCategoryFilters()

    const activeCategory = filters.category as string | undefined;;
    const activeCategoryData = data.find(
        (category) => category.slug === activeCategory
    ) || data.flatMap((category) => category.subcategories || [])
        .find((sub) => sub.slug === activeCategory);
    const activeCategoryColor = activeCategoryData?.color || DEFAULT_BG_COLOR;


    return (
        <div className="px-4 lg:px-12 py-8 border-b hidden lg:flex flex-col gap-4 w-full"
             style={{ backgroundColor: activeCategoryColor }}>
            <Categories data={data}/>
        </div>
    )
}

export const SearchFiltersLoading = () => {
    return (
        <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
            style={{ backgroundColor: "#F5F5F5" }}>
            <div className="hidden lg:block">
                <div className="h-11"/>
            </div>

        </div>
    )
}