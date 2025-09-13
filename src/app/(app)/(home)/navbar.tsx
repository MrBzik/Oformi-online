"use client"

import "./navbar.css"
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {SearchInput} from "@/app/(app)/(home)/search-filters/search-input";
import {useProductFilters} from "@/modules/products/hooks/use-product-filters";
import {MainHeader} from "@/modules/shared/ui/components/main-header";
import {SignInButton} from "@/modules/auth/ui/components/sign-in-button";
import {Suspense} from "react";
import {DEFAULT_HEADER_COLOR} from "@/modules/home/constants";
import {Categories} from "@/app/(app)/(home)/search-filters/categories";


export const Navbar = () => {

    const trpc = useTRPC()
    const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
    const [filters, setFilters] = useProductFilters();

    const activeCategory = filters.category as string | undefined;
    const activeCategoryData = data.find(
        (category) => category.slug === activeCategory
    ) || data.flatMap((category) => category.subcategories || [])
        .find((sub) => sub.slug === activeCategory);
    const activeCategoryColor = activeCategoryData?.color || DEFAULT_HEADER_COLOR;

    return (
        <nav className="z-100 sticky top-0 p-6 border-b-[2px]"
             style={{ backgroundColor: activeCategoryColor }}
        >
            <div className="max-w-(--breakpoint-2xl) mx-auto flex flex-col gap-y-4">
                <div className="flex flex-col lg:flex-row font-medium items-center gap-y-4 lg:gap-x-4 m-4 lg:m-0">
                    <MainHeader/>
                    <SearchInput
                        categories={data}
                        defaultValue={filters.search}
                        onSearchChange={(searchInput) => setFilters({
                            search: searchInput,
                        })}
                        onCategoryChange={(categorySlug) => setFilters({
                            category: categorySlug,
                        })}
                    />

                    <SignInButton/>
                </div>
                <Suspense fallback={<SearchFiltersLoading/>}>
                    <div className="hidden lg:flex flex-col gap-4 w-full ">
                        <Categories data={data}/>
                    </div>
                </Suspense>
            </div>



        </nav>
    )
}

const SearchFiltersLoading = () => {
    return (
        <div className="hidden lg:flex flex-col gap-4 w-full "
             style={{ backgroundColor: DEFAULT_HEADER_COLOR }}>
            <div className="hidden lg:block">
                <div className="h-11"/>
            </div>
        </div>
    )
}