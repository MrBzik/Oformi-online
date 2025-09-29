"use client"

import {PriceFilter} from "@/modules/products/ui/components/price-filter";
import {useProductSideFilters} from "@/modules/products/hooks/use-product-filters";
import {TagsFilter} from "@/modules/products/ui/components/tags-filter";
import {Suspense} from "react";

interface Props {
    category?: string
}

export const ProductFilters = ({category} : Props) => {

    const [filters, setFilters] = useProductSideFilters();

    const hasFilters = Object.entries(filters).some(([, value]) => {
        if(Array.isArray(value)) {
            return value.length > 0;
        }

        return value !== "";
    })

    const onClear = () => {
        setFilters({
            minPrice: "",
            maxPrice: "",
            tags: []
        })
    }

    const onChange = (key: keyof typeof filters, value: unknown) => {
        setFilters({...filters, [key]: value});
    }

    return(
        <div className="flex flex-col gap-2">

            <div className="p-4 border flex items-center justify-between rounded-md bg-card-primary">
                <p className="font-medium text-sm">Фильтры</p>
                {hasFilters ? <button className="text-sm underline cursor-pointer" onClick={onClear} type="button">
                    Очистить
                </button> : <span className="text-muted-foreground text-sm">Очищено</span>}
            </div>
            <PriceFilter
                minPrice={filters.minPrice}
                maxPrice={filters.maxPrice}
                onMinPriceChange={(value) => onChange("minPrice", value)}
                onMaxPriceChange={(value) => onChange("maxPrice", value)}
            />
            <Suspense>
                <TagsFilter
                    value={filters.tags}
                    onChange={(value) => onChange("tags", value)}
                    category={category}
                />
            </Suspense>
        </div>
    )
}