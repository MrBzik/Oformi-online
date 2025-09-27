"use client"

import {ProductSort} from "@/modules/products/ui/components/product-sort";
import {ProductFilters} from "@/modules/products/ui/components/product-filters";
import {Suspense, useEffect} from "react";
import {ProductList, ProductListLoading} from "@/modules/products/ui/components/product-list";
import {useTRPC} from "@/trpc/client";
import {useMutation, useSuspenseQuery} from "@tanstack/react-query";
import {BreadcrumbNavigation} from "@/app/(app)/(home)/search-filters/breadcrumb-navigation";
import {useProductFilters} from "@/modules/products/hooks/use-product-filters";
import {cn} from "@/lib/utils";
import {useParams} from "next/navigation";

interface Props {
    category?: string;
    tenantSlug?: string;
    narrowView?: boolean;
    refLink?: string;
}

export const ProductListView = ({
    category,
    tenantSlug,
    narrowView,
    refLink
} : Props) => {

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

    const params = useParams();

    const handleRefLink = useMutation(trpc.referral.addReferralCookie.mutationOptions({}))

    const [filters] = useProductFilters();

    const activeCategory = params.category as string | undefined;
    const activeCategoryData = data.find((category) => category.slug === activeCategory);
    const activeCategoryName = activeCategoryData?.name || null;

    const activeSubcategory = params.subcategory as string | undefined;
    const activeSubcategoryName = activeCategoryData?.subcategories?.find(
        (subcategory) => subcategory.slug === activeSubcategory
    )?.name || null;

    const isDisplayFilters = category || filters.search;

    useEffect(() => {
        handleRefLink.mutate({refLink: refLink})
    }, []);

    return (
        <div className="px-4 lg:px-12 py-2 lg:py-8 flex flex-col gap-2 lg:gap-4">
            <div className="flex gap-y-2 lg:gap-y-0 justify-between items-center">
                <BreadcrumbNavigation
                    activeCategory={activeCategory}
                    activeCategoryName={activeCategoryName}
                    activeSubcategoryName={activeSubcategoryName}
                />
                <ProductSort/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-7 xl:grid-cols-9 gap-y-6 gap-x-12 ">
                {isDisplayFilters && (
                    <div className="col-span-2">
                        <ProductFilters category={category}/>
                    </div>
                )}

                <div className={cn("lg:col-span-5 xl:col-span-7",
                    !isDisplayFilters && "lg:col-span-7 xl:col-span-9"
                    )}>
                    <Suspense fallback={<ProductListLoading wideView={!isDisplayFilters}/>}>
                        <ProductList
                            category={category}
                            tenantSlug={tenantSlug}
                            narrowView={narrowView}
                            wideView={!isDisplayFilters}
                        />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};