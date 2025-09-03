import {BookmarkCheckIcon, ListFilterIcon, SearchIcon} from "lucide-react";
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
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500"/>
                <Input
                    className="pl-8 bg-card-primary border-[2px] border-gray-500 hover:border-black"
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
                    }}
                />
            </div>
            <Button
                className="size-12 shrink-0 flex"
                onClick={() => onSearchChange?.(searchValue)}>
                <SearchIcon/>
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