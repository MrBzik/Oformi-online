"use client"

import {CategoryDropdown} from "@/app/(app)/(home)/search-filters/category-dropdown";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {ListFilterIcon} from "lucide-react";
import {CategoriesSidebar} from "@/app/(app)/(home)/search-filters/categories-sidebar";
import {CategoriesList} from "@/modules/categories/types";
import {useParams} from "next/navigation";

interface Props {
    data: CategoriesList
}

export const Categories = ({data} : Props) => {

    const params = useParams();

    const [isAnyHovered, setIsAnyHovered] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const categoryParam = params.category as string | undefined;
    const activeCategory = categoryParam || "all";

    const activeCategoryIndex = data.findIndex((cat) => cat.slug === activeCategory);
    const isActiveCategoryHidden = activeCategoryIndex >= 30 && activeCategoryIndex !== -1;


    return (
        <div className="relative w-full">
            <CategoriesSidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} data={data}/>
            <div
                onMouseEnter={() => setIsAnyHovered(true)}
                onMouseLeave={() => setIsAnyHovered(false)}
                className="flex flex-wrap items-center w-full gap-2">
                {data.slice(0, 30).map((category) => (
                    <div key={category.id}>
                        <CategoryDropdown
                            category={category}
                            isActive={activeCategory === category.slug}
                            isNavigationHovered={isAnyHovered}
                        />
                    </div>
                ))}
                <div className="shrink-0">
                    <Button className={cn("h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
                        isActiveCategoryHidden && !isAnyHovered && "bg-white border-primary")}
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        Больше категорий
                        <ListFilterIcon className="ml-2"/>
                    </Button>
                </div>
            </div>
        </div>
    )
}