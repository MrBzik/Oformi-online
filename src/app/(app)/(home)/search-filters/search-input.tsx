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
import {usePathname, useRouter} from "next/navigation";
import {Category} from "@/payload-types";
import {DEFAULT_HEADER_COLOR} from "@/modules/home/constants";

interface Props {
    disabled?: boolean;
    defaultValue?: string | undefined;
    onChange?: (value: string) => void;
    categories: CategoriesList;
    onCategoryColorChange: (color: string) => void
}

export const SearchInput = (
    {
        disabled,
        defaultValue,
        onChange,
        categories,
        onCategoryColorChange
}: Props ) => {

    const [searchValue, setSearchValue] = useState(defaultValue || "");
    const [searchDebounced, setSearchDebounced] = useState("");
    const [isClickedSearchSuggestions, setIsClickedSearchSuggestions] = useState(false);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const trpc = useTRPC()
    const session = useQuery(trpc.auth.session.queryOptions())

    const router = useRouter()

    const {data : suggestions} = useQuery(trpc.products.getSuggestions.queryOptions({
        search: searchDebounced
    }))

    useEffect(() => {
        const handler = setTimeout(() => {
            if(searchValue != defaultValue){
                if(isClickedSearchSuggestions){
                    setIsClickedSearchSuggestions(false);
                } else {
                    setSearchDebounced(searchValue)
                }
            }
        }, 1000)

        return () => {
            clearTimeout(handler)
        }

    }, [searchValue])

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreen = () => setIsMobile(window.innerWidth < 1024);
        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    const pathname = usePathname();


    return (
        <div className="flex items-center gap-4 w-full">
            <CategoriesSidebar
                onCategoryColorChange={onCategoryColorChange}
                isOpen={isSidebarOpen}
                onOpenChange={setIsSidebarOpen}
                data={categories}
            />
            <div className="relative w-full lg:rounded-xl bg-gradient-to-r from-sky-600 to-input-primary px-12 py-2">
                <ListFilterIcon
                    className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-white cursor-pointer"
                    onClick={() => setIsSidebarOpen(true)}
                />
                <Input
                    className="bg-card-primary rounded-xl border-0"
                    placeholder={isMobile ? "Оформи онлайн" : "Найти услугу"}
                    disabled={disabled}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === "Enter") {
                            onChange?.(searchValue)
                        }
                    }}
                />
                <SearchSuggestions
                    suggestions={suggestions}
                    onClose={() => setSearchDebounced("")}
                    onSuggestionClick={(el) => {
                        setSearchDebounced("")
                        setSearchValue(el.productName)
                        setIsClickedSearchSuggestions(true)
                        const parentCategory = el.category.parent as Category | null
                        onCategoryColorChange(parentCategory?.color || DEFAULT_HEADER_COLOR)
                        router.push(`/${parentCategory ? parentCategory.slug + "/" : ""}${el.category.slug}?search=${el.productName}`)
                    }}
                />

                <SearchIcon
                    className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-neutral-500 cursor-pointer"
                    style={{color: "white"}}
                    onClick={() => {onChange?.(searchValue)}}
                />
            </div>
            <div className="hidden lg:flex gap-3">
                <Link
                    href={session.data?.user ? "/profile" : "/sign-in"}
                    className="flex flex-col items-center hover:text-input-primary"
                >
                    <Icon icon="mingcute:user-2-line" width="24" height="24" style={{color: 'black'} } />
                    <span className="text-xs">
                        {
                            session.data?.user ? "Профиль" : "Войти"
                        }
                    </span>
                </Link>

                {session.data?.user && (
                    <Link
                        href="/favourite"
                        className="flex flex-col items-center hover:text-input-primary"
                    >
                        <Icon
                            icon={
                                pathname === '/favourite'
                                    ? 'mingcute:heart-fill' // filled version
                                    : 'mingcute:heart-line' // outline version
                            }
                            width="24" height="24" style={{color: 'black'} } />
                        <span className="text-xs">
                        Избранное
                        </span>
                    </Link>
                )}

                <Link
                    href="/referral"
                    className="flex flex-col items-center hover:text-input-primary"
                >
                    <Icon icon={
                        pathname === '/referral'
                            ? "f7:money-rubl-circle-fill"
                            : 'f7:money-rubl-circle'
                    }
                          width="24" height="24" style={{color: 'black'}}  />
                    <span className="text-xs ">
                        Доход
                    </span>
                </Link>
            </div>


        </div>
    )
}