"use client"

import {useState} from "react";
import {ChevronDownIcon, ChevronRightIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {PriceFilter} from "@/modules/products/ui/components/price-filter";
import {useProductSideFilters} from "@/modules/products/hooks/use-product-filters";
import {TagsFilter} from "@/modules/products/ui/components/tags-filter";

interface ProductFilterProps {
    title: string;
    className?: string;
    children: React.ReactNode;
}

const ProductFilter = ({
    title, className, children
} : ProductFilterProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

    return (
        <div className={cn(
            "p-4 border-b flex flex-col gap-2",
            className
        )}>
            <div onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between cursor-pointer">
                <p className="font-medium">{title}</p>
                <Icon className="size-5"/>
            </div>
            {isOpen && children}
        </div>
    )
}

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
        <div className="border rounded-md bg-card-primary">
            <div className="p-4 border-b flex items-center justify-between">
                <p className="font-medium">Фильтры</p>
                {hasFilters && <button className="underline cursor-pointer" onClick={onClear} type="button">
                    Очистить
                </button>}
            </div>
            <ProductFilter title="Цена" className="border-b-0">
                <PriceFilter
                minPrice={filters.minPrice}
                maxPrice={filters.maxPrice}
                onMinPriceChange={(value) => onChange("minPrice", value)}
                onMaxPriceChange={(value) => onChange("maxPrice", value)}
                />
            </ProductFilter>
            <ProductFilter title="Тэги">
                <TagsFilter
                value={filters.tags}
                onChange={(value) => onChange("tags", value)}
                category={category}
                />
            </ProductFilter>
        </div>
    )
}