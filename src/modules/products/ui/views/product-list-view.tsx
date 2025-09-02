"use client"

import {ProductSort} from "@/modules/products/ui/components/product-sort";
import {ProductFilters} from "@/modules/products/ui/components/product-filters";
import {Suspense} from "react";
import {ProductList, ProductListLoading} from "@/modules/products/ui/components/product-list";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import {BreadcrumbNavigation} from "@/app/(app)/(home)/search-filters/breadcrumb-navigation";

interface Props {
    category?: string;
    tenantSlug?: string;
    narrowView?: boolean;
}

export const ProductListView = ({
    category,
    tenantSlug,
    narrowView,
} : Props) => {

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

    const params = useParams();
    const activeCategory = params.category as string | undefined;
    const activeCategoryData = data.find((category) => category.slug === activeCategory);
    const activeCategoryName = activeCategoryData?.name || null;

    const activeSubcategory = params.subcategory as string | undefined;
    const activeSubcategoryName = activeCategoryData?.subcategories?.find(
        (subcategory) => subcategory.slug === activeSubcategory
    )?.name || null;


    return (
        <div className="px-4 lg:px-12 py-8 flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between">
                <BreadcrumbNavigation
                    activeCategory={activeCategory}
                    activeCategoryName={activeCategoryName}
                    activeSubcategoryName={activeSubcategoryName}/>
                <ProductSort/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
                <div className="lg:col-span-2 xl:col-span-2">
                    <ProductFilters category={category}/>
                </div>
                <div className="lg:col-span-4 xl:col-span-6">
                    <Suspense fallback={<ProductListLoading narrowView={narrowView }/>}>
                        <ProductList category={category} tenantSlug={tenantSlug} narrowView={narrowView} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};