"use client"

import {sortValues, useProductSortFilters} from "@/modules/products/hooks/use-product-filters";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

export const ProductSort = () => {
    const [{sort}, setFilters] = useProductSortFilters()

    return (
        <div className="flex flex-wrap items-center gap-1">
            {sortValues.map((item) => (
                <Button
                key={item}
                variant="secondary"
                className={cn(
                    "rounded-full bg-white hover:bg-white",
                    sort != item && "bg-transparent border-transparent hover:border-border hover:bg-transparent",
                )}
                onClick={() => setFilters({sort: item})}
                >
                    {item}
                </Button>
            ))}
        </div>
    )

}