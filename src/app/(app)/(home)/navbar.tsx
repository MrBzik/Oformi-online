"use client"

import "./navbar.css"
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {SearchInput} from "@/app/(app)/(home)/search-filters/search-input";
import {useProductFilters} from "@/modules/products/hooks/use-product-filters";
import {MainHeader, MainHeaderTwoLines} from "@/modules/shared/ui/components/main-header";
import {Suspense, useRef} from "react";
import {DEFAULT_HEADER_COLOR} from "@/modules/home/constants";
import {Categories} from "@/app/(app)/(home)/search-filters/categories";
import Image from "next/image";
import useScrollThreshold from "@/modules/shared/hooks/use-scroll-trashhold";
import {useParams} from "next/navigation";

export const Navbar = () => {

    const trpc = useTRPC()
    const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
    const [filters, setFilters] = useProductFilters();

    const params = useParams();

    const activeCategory = params.category as string | undefined;
    const activeCategoryData = data.find((category) => category.slug === activeCategory);
    const activeCategoryColor = activeCategoryData?.color || DEFAULT_HEADER_COLOR;

    const navContainer = useRef<HTMLDivElement>(null)

    const showNavBar = useScrollThreshold(navContainer)

    return (
        <>
            <nav
                ref={navContainer}
                className="sticky top-0 z-20 lg:static lg:p-6 border-0 border-b-[2px] lg:border-l-[2px] lg:border-r-[2px] lg:rounded-bl-4xl lg:rounded-br-4xl flex flex-col gap-y-4"
                // style={{ backgroundColor: activeCategoryColor}}
                 style={{ background: `linear-gradient(to top, ${activeCategoryColor}, ${DEFAULT_HEADER_COLOR})` }}
            >
                <div className="flex font-medium items-center gap-y-4 lg:gap-x-4 m-4 lg:m-0">
                    <div className="hidden lg:block shrink-0">
                        <Image src="/big_logo.png" alt="logo" width={120} height={120} className="absolute -translate-y-1/4 -translate-x-1/6"/>
                        <MainHeaderTwoLines/>
                    </div>
                    <SearchInput
                        categories={data}
                        defaultValue={filters.search}
                        onChange={(searchInput) => setFilters({
                            search: searchInput,
                        })}
                    />
                </div>
                <Suspense fallback={<SearchFiltersLoading/>}>
                    <div className="hidden lg:flex flex-col gap-4 w-full ">
                        <Categories data={data}/>
                    </div>
                </Suspense>
            </nav>
            {
                showNavBar && (
                    <nav
                        className="z-20 hidden lg:block fixed w-full border-0 border-b-[2px] lg:border-l-[2px] lg:border-r-[2px] lg:rounded-bl-4xl lg:rounded-br-4xl"
                        style={{ background: `linear-gradient(to top, ${activeCategoryColor}, ${DEFAULT_HEADER_COLOR})` }}
                    >
                        <div className="flex font-medium items-center gap-x-4 m-4">
                            <div className="hidden lg:block shrink-0">
                                <MainHeader/>
                            </div>
                            <SearchInput
                                categories={data}
                                defaultValue={filters.search}
                                onChange={(searchInput) => setFilters({
                                    search: searchInput,
                                })}
                            />
                        </div>
                    </nav>
                )
            }
        </>

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