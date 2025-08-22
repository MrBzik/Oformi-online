"use client"

import {BookmarkCheckIcon, DeleteIcon, ListFilterIcon, SearchIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {CategoriesSidebar} from "@/app/(app)/(home)/search-filters/categories-sidebar";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {CategoriesList} from "@/modules/categories/types";
import {useTRPC} from "@/trpc/client";
import {useQuery} from "@tanstack/react-query";
import Link from "next/link";
import {useProductFilters} from "@/modules/products/hooks/use-product-filters";

interface Props {
    disabled?: boolean;
    data: CategoriesList;
}

export const SearchInput = (
    {disabled, data }: Props
) => {

    const [filters, setFilters] = useProductFilters();
    const [searchValue, setSearchValue] = useState(filters.search);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const trpc = useTRPC()
    const session = useQuery(trpc.auth.session.queryOptions())

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setFilters({search: searchValue});
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [searchValue, setFilters])

    return (
        <div className="flex items-center gap-2 w-full">
            <CategoriesSidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} data={data}/>
            <div className="relative w-full">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500"/>
                <Input
                    className="pl-8"
                    placeholder="Найти услугу"
                    disabled={disabled}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            <Button
                disabled={searchValue === ""}
                className="size-12 shrink-0 flex"
                onClick={() => setSearchValue("")}>
                <DeleteIcon/>
            </Button>
            <Button
             className="size-12 shrink-0 flex"
            onClick={() => setIsSidebarOpen(true)}>
                <ListFilterIcon/>
            </Button>
            {session.data?.user && (
                <Button asChild>
                    <Link href="/library">
                        <BookmarkCheckIcon/>
                        Избранное
                    </Link>
                </Button>
            )}
        </div>
    )
}