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

interface Props {
    category?: string;
    tenantSlug?: string;
    narrowView?: boolean;
    refLink?: string;
}

export const ProductListView = ({
    tenantSlug,
    narrowView,
    refLink
} : Props) => {

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

    const handleRefLink = useMutation(trpc.referral.addReferralCookie.mutationOptions({}))

    const [filters, setFilters] = useProductFilters();

    const activeCategory = filters.category as string | undefined;
    const activeCategoryData = data.find((category) => category.slug === activeCategory) || data.find(category => category.subcategories?.find(sub => sub.slug === activeCategory));
    const activeCategoryName = activeCategoryData?.name || null;

    const activeSubcategoryName = activeCategoryData?.subcategories?.find(
        (subcategory) => subcategory.slug === activeCategory
    )?.name || null;

    const isDisplayFilters = filters.category || filters.search;

    useEffect(() => {
        if(!filters.category && !filters.search){
            setFilters({maxPrice: "", minPrice: "", tags: []})
        }
    }, [filters.search, filters.category])

    useEffect(() => {
        handleRefLink.mutate({refLink: refLink})
    }, []);

    return (
        <div className="px-4 lg:px-12 py-8 flex flex-col gap-4">
            <div className="flex gap-y-2 lg:gap-y-0 justify-between items-center">
                <BreadcrumbNavigation
                    activeCategory={activeCategoryData?.slug}
                    activeCategoryName={activeCategoryName}
                    activeSubcategoryName={activeSubcategoryName}
                    onNavigate={(category) => setFilters({category: category})}
                />
                <ProductSort/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
                {isDisplayFilters && (
                    <div className="lg:col-span-2 xl:col-span-2">
                        <ProductFilters category={filters.category}/>
                    </div>
                )}

                <div className={cn("lg:col-span-4 xl:col-span-6",
                    !isDisplayFilters && "lg:col-span-6 xl:col-span-8"
                    )}>
                    <Suspense fallback={<ProductListLoading wideView={!isDisplayFilters}/>}>
                        <ProductList
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