import {HeartIcon, ListFilterIcon, SearchIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {CategoriesSidebar} from "@/app/(app)/(home)/search-filters/categories-sidebar";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {CategoriesList} from "@/modules/categories/types";
import {useTRPC} from "@/trpc/client";
import {useQuery} from "@tanstack/react-query";
import Link from "next/link";
import {SearchSuggestions} from "@/app/(app)/(home)/search-filters/search-suggestions";

interface Props {
    disabled?: boolean;
    defaultValue?: string | undefined;
    onSearchChange?: (searchInput: string) => void;
    onCategoryChange?: (category: string) => void;
    categories: CategoriesList;
}

export const SearchInput = (
    {
        disabled,
        defaultValue,
        onSearchChange,
        onCategoryChange,
        categories
}: Props ) => {

    const [searchValue, setSearchValue] = useState(defaultValue || "");
    const [searchDebounced, setSearchDebounced] = useState("");

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const trpc = useTRPC()
    const session = useQuery(trpc.auth.session.queryOptions())

    const {data : suggestions} = useQuery(trpc.products.getSuggestions.queryOptions({
        search: searchDebounced
    }))

    useEffect(() => {
        const handler = setTimeout(() => {
            if(searchValue != defaultValue){
                setSearchDebounced(searchValue)
            }
        }, 1000)

        return () => {
            clearTimeout(handler)
        }

    }, [searchValue])

    return (
        <div className="flex items-center gap-2 w-full">
            <CategoriesSidebar
                isOpen={isSidebarOpen}
                onOpenChange={setIsSidebarOpen}
                data={categories}
                onCategoryPick={(categorySlug: string) => onCategoryChange?.(categorySlug)}
            />
            <div className="relative w-full">
                <Input
                    className="pr-8 bg-card-primary border-[2px] border-gray-500 hover:border-black"
                    placeholder="Найти услугу"
                    disabled={disabled}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === "Enter") {
                            onSearchChange?.(searchValue)
                        }
                    }}
                />
                <SearchSuggestions
                    suggestions={suggestions}
                    onClose={() => setSearchDebounced("")}
                    onSuggestionClick={(el) => {
                        setSearchDebounced("")
                        setSearchValue(el.productName)
                        onSearchChange?.(el.productName)
                        onCategoryChange?.(el.category.slug)
                    }}
                />
                <SearchIcon className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-neutral-500 cursor-pointer"
                            onClick={() => {onSearchChange?.(searchValue)}}
                />
            </div>
            <Button
             className="size-12 shrink-0 flex"
            onClick={() => setIsSidebarOpen(true)}>
                <ListFilterIcon/>
            </Button>
            {session.data?.user && (
                <Button asChild className="hidden lg:flex">
                    <Link href="/favourite">
                        <HeartIcon/>
                        Избранное
                    </Link>
                </Button>
            )}
        </div>
    )
}