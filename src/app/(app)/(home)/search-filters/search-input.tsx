import {BookmarkCheckIcon, ListFilterIcon, SearchIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {CategoriesSidebar} from "@/app/(app)/(home)/search-filters/categories-sidebar";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {CategoriesList} from "@/modules/categories/types";
import {useTRPC} from "@/trpc/client";
import {useQuery} from "@tanstack/react-query";
import Link from "next/link";

interface Props {
    disabled?: boolean;
    defaultValue?: string | undefined;
    onChange?: (value: string) => void;
    data: CategoriesList;
}

export const SearchInput = (
    {
        disabled,
        defaultValue,
        onChange,
        data
}: Props ) => {

    const [searchValue, setSearchValue] = useState(defaultValue || "");

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const trpc = useTRPC()
    const session = useQuery(trpc.auth.session.queryOptions())

    return (
        <div className="flex items-center gap-2 w-full">
            <CategoriesSidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} data={data}/>
            <div className="relative w-full">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500"/>
                <Input
                    className="pl-8 bg-card-primary border-[2px] border-gray-500 hover:border-black"
                    placeholder="Найти услугу"
                    disabled={disabled}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            <Button
                className="size-12 shrink-0 flex"
                onClick={() => onChange?.(searchValue)}>
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