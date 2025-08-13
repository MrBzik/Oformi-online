"use client"

import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useState} from "react";
import {ChevronLeftIcon, ChevronRightIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import {CategoriesType, CategoryItem} from "@/modules/categories/types";

interface Props {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    data: CategoriesType;
}

export const CategoriesSidebar = (
    { isOpen, onOpenChange, data } : Props) => {
    const router = useRouter()

    const [parentCategories, setParentCategories] = useState<CategoriesType | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);

    const currentCategories = parentCategories ?? data ?? [];

    const handleOpenChange = (isOpen: boolean) => {
        setSelectedCategory(null);
        setParentCategories(null);
        onOpenChange(isOpen);
    }

    const handleCategoryClick = (category: CategoryItem) => {
        if(category.subcategories && category.subcategories.length > 0) {
            setParentCategories(category.subcategories as CategoriesType);
            setSelectedCategory(category)
        } else {
            if (parentCategories && selectedCategory) {
                router.push(`${selectedCategory.slug}/${category.slug}`);
            } else {
                if (category.slug === "all") {
                    router.push("/");
                } else {
                    router.push(`/${category.slug}`);
                }
            }
            handleOpenChange(false);
        }
    }

    const handleBackClick = () => {
        if(parentCategories) {
            setParentCategories(null);
            setSelectedCategory(null);
        }
    }

    const backgroundColor = selectedCategory?.color || "white"

    return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetContent
            side="left"
            className="p-0 transition-none"
            style={{backgroundColor}}
            >
                <SheetHeader className="p-4 border-b">
                    <SheetTitle>
                        Категории
                    </SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
                    {parentCategories && (
                        <button
                        onClick={handleBackClick}
                        className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer"
                        >
                            <ChevronLeftIcon className="size-4 mr-2"/>
                            Назад
                        </button>
                    )}
                    {currentCategories.map((category) => (
                        <button
                        key={category.slug}
                        onClick={() => handleCategoryClick(category)}
                        className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium cursor-pointer">
                            {category.name}
                            {category.subcategories && category.subcategories.length > 0 && (
                                <ChevronRightIcon className="size-4"/>
                            )}
                        </button>
                    ))}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}