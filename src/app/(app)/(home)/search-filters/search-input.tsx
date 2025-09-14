import {ListFilterIcon, SearchIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {CategoriesSidebar} from "@/app/(app)/(home)/search-filters/categories-sidebar";
import {useEffect, useState} from "react";
import {CategoriesList} from "@/modules/categories/types";
import {useTRPC} from "@/trpc/client";
import {useQuery} from "@tanstack/react-query";
import Link from "next/link";
import {SearchSuggestions} from "@/app/(app)/(home)/search-filters/search-suggestions";
import {Icon} from "@iconify/react";

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
        <div className="flex items-center gap-4 w-full">
            <CategoriesSidebar
                isOpen={isSidebarOpen}
                onOpenChange={setIsSidebarOpen}
                data={categories}
                onCategoryPick={(categorySlug: string) => onCategoryChange?.(categorySlug)}
            />
            <div className="relative w-full">
                <div className="absolute w-full border-x-[55px] border-input-primary rounded-xl h-12 pointer-events-none"/>
                <div className="absolute left-12 w-[calc(100%-6rem)] border-x-[7px] border-white rounded-xl h-12 pointer-events-none"/>
                <div className="absolute w-full border-[2px] border-input-primary rounded-xl h-12 pointer-events-none"/>
                <ListFilterIcon
                    className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-white cursor-pointer"
                    onClick={() => setIsSidebarOpen(true)}
                />
                <Input
                    className="px-14 bg-card-primary rounded-xl"
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

                <SearchIcon
                    className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-neutral-500 cursor-pointer"
                    style={{color: "white"}}
                    onClick={() => {onSearchChange?.(searchValue)}}
                />
            </div>
            <div className="flex gap-3">
                <Link
                    href={session.data?.user ? "/profile" : "/sign-in"}
                    className="hidden lg:flex flex-col items-center"
                >
                    <Icon icon="mingcute:user-2-line" width="24" height="24" style={{color: 'black'} } />
                    <span className="text-xs underline">
                        {
                            session.data?.user ? "Профиль" : "Войти"
                        }
                    </span>
                </Link>

                {session.data?.user && (
                    <Link
                        href="/favourite"
                        className="hidden lg:flex flex-col items-center"
                    >
                        <Icon icon="mingcute:heart-line" width="24" height="24" style={{color: 'black'} } />
                        <span className="text-xs underline">
                        Избранное
                    </span>
                    </Link>
                )}

                {session.data?.user && (
                    <Link
                        href="/referral"
                        className="hidden lg:flex flex-col items-center"
                    >
                        <Icon icon="mingcute:link-line" width="24" height="24" style={{color: 'black'}}  />
                        <span className="text-xs underline">
                        Доход
                    </span>
                    </Link>
                )}
            </div>


        </div>
    )
}