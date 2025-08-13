"use client"

import {ListFilterIcon, SearchIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {CategoriesSidebar} from "@/app/(app)/(home)/search-filters/categories-sidebar";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {CategoriesList} from "@/modules/categories/types";

interface Props {
    disabled?: boolean;
    data: CategoriesList;
}

export const SearchInput = (
    {disabled, data }: Props
) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex items-center gap-2 w-full">
            <CategoriesSidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} data={data}/>
            <div className="relative w-full">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500"/>
                <Input className="pl-8" placeholder="Найти услугу" disabled={disabled}/>
            </div>
            <Button
             className="size-12 shrink-0 flex"
            onClick={() => setIsSidebarOpen(true)}>
                <ListFilterIcon/>
            </Button>
        </div>
    )
}