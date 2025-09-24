"use client"

import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useRef, useState} from "react";
import {SubcategoryMenu} from "./subcategory-menu";
import {CategoryItem} from "@/modules/categories/types";
import {useRouter} from "next/navigation";
import {DEFAULT_HEADER_COLOR} from "@/modules/home/constants";

interface Props {
    category: CategoryItem,
    isActive? : boolean,
    isNavigationHovered? : boolean,
    onCategoryColorChange: (color: string) => void,
    isHidden: boolean
}

export const CategoryDropdown = (
    {
        category,
        isActive,
        isNavigationHovered,
        onCategoryColorChange,
        isHidden,
    }: Props
) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const router = useRouter()

    const onMouseEnter = () => {
        if(category.subcategories){
            setIsOpen(true);
        }
    }
    const onMouseLeave = () => {
        setIsOpen(false);
    }

    return (
        <div className={cn("relative", isHidden && "invisible pointer-events-none")}
             ref={dropdownRef}
             onMouseEnter={onMouseEnter}
             onMouseLeave={onMouseLeave}
             >
            <div className="relative">
                <Button className={cn("h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
                    isActive && !isNavigationHovered && "bg-white border-primary",
                    isOpen && "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[4px] -translate-y-[4px] border-primary"
                    )}
                        onClick={() => {
                            if(isActive){
                                router.push("/")
                                onCategoryColorChange(DEFAULT_HEADER_COLOR)
                            } else {
                                onCategoryColorChange(category.color || DEFAULT_HEADER_COLOR)
                                router.push(`/${category.slug}`)
                            }
                        }}
                >
                    {category.name}
                </Button>
                {category.subcategories && category.subcategories.length > 0 && (
                    <div className={cn(
                        "opacity-0 absolute -bottom-3 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-black left-1/2 -translate-x-1/2",
                        isOpen && "opacity-100",
                    )}/>
                )}
            </div>
            <SubcategoryMenu
                onCategoryColorChange={onCategoryColorChange}
                category={category}
                isOpen={isOpen}
            />
        </div>
    )
}