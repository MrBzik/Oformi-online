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
            <div className="relative w-full rounded-xl bg-gradient-to-r from-sky-600 to-input-primary px-12 py-2">
                <ListFilterIcon
                    className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-white cursor-pointer"
                    onClick={() => setIsSidebarOpen(true)}
                />
                <Input
                    className="bg-card-primary rounded-xl border-0"
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
            <div className="hidden lg:flex gap-3">
                <Link
                    href={session.data?.user ? "/profile" : "/sign-in"}
                    className="flex flex-col items-center"
                >
                    <Icon icon="mingcute:user-2-line" width="32" height="32" style={{color: 'black'} } />
                    <span className="text-md underline">
                        {
                            session.data?.user ? "Профиль" : "Войти"
                        }
                    </span>
                </Link>

                {session.data?.user && (
                    <Link
                        href="/favourite"
                        className="flex flex-col items-center"
                    >
                        <Icon icon="mingcute:heart-line" width="32" height="32" style={{color: 'black'} } />
                        <span className="text-md underline">
                        Избранное
                    </span>
                    </Link>
                )}

                <Link
                    href="/referral"
                    className="flex flex-col items-center"
                >
                    <Icon icon="mingcute:link-line" width="32" height="32" style={{color: 'black'}}  />
                    <span className="text-md underline">
                        Доход
                    </span>
                </Link>
            </div>


        </div>
    )
}