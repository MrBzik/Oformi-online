import {Category} from "@/payload-types";
import {CategoryItem} from "@/modules/categories/types";
import {useCategoryFilters} from "@/modules/products/hooks/use-product-filters";

interface Props {
    category: CategoryItem,
    isOpen: boolean,
}

export const SubcategoryMenu = (
    {   category,
        isOpen,
    }: Props
) => {

    const [, setFilters] = useCategoryFilters()

    if (!isOpen || !category.subcategories || category.subcategories.length === 0) {
        return null;
    }
    const bgColor = category.color || "#F5F5F5";

    return (
        <div className="absolute z-100"
        style={{
            top: "100%",
            left: 0,
        }}>
            <div className="h-3 w-60"/>
            <div style={{background: bgColor}}
                className="w-60 text-black rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[2px] -translate-y-[2px]">
                <div>
                    {category.subcategories?.map((subcategory: Category) => (
                        <div key = {subcategory.slug}
                              onClick={() => setFilters({category: subcategory.slug})}
                        className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center underline font-medium">
                            {subcategory.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}