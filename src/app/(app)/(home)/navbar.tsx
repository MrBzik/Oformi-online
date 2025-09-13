"use client"

import "./navbar.css"
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {SearchInput} from "@/app/(app)/(home)/search-filters/search-input";
import {useProductFilters} from "@/modules/products/hooks/use-product-filters";
import {MainHeader} from "@/modules/shared/ui/components/main-header";
import {SignInButton} from "@/modules/auth/ui/components/sign-in-button";


export const Navbar = () => {

    const trpc = useTRPC()
    const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
    const [filters, setFilters] = useProductFilters();

    return (
        <nav className="h-30 flex flex-col lg:flex-row font-medium items-center gap-y-4 lg:gap-x-4 m-4 lg:m-0 bg-bg-secondary z-100 sticky top-0">
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
        </nav>
    )
}