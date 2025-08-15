"use client"

import {sortValues, useProductFilters} from "@/modules/products/hooks/use-product-filters";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

export const ProductSort = () => {
    const [filters, setFilters] = useProductFilters()

    return (
        <div className="flex items-center gap-2">
            {sortValues.map((item) => (
                <Button
                key={item}
                variant="secondary"
                className={cn(
                    "rounded-full bg-white hover:bg-white",
                    filters.sort != item && "bg-transparent border-transparent hover:border-border hover:bg-transparent",
                )}
                onClick={() => setFilters({sort: item})}
                >
                    {item}
                </Button>
            ))}
        </div>
    )

}