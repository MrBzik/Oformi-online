"use client"

import {useProductSortFilters} from "@/modules/products/hooks/use-product-filters";
import {Button} from "@/components/ui/button";
import {sortValues} from "@/modules/products/search-params";
import {useState} from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {ChevronDownIcon} from "lucide-react";

export const ProductSort = () => {
    const [{sort}, setFilters] = useProductSortFilters()
    const [position, setPosition] = useState(sort)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    asChild
                    className="border-0 w-fit"
                    variant="ghost">
                    <div>
                        {position}
                        <ChevronDownIcon/>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-46">
                <DropdownMenuLabel>Сортировка</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={position} onValueChange={(e) => {
                    const selection = e as typeof sortValues[number]
                    setFilters({sort: selection})
                    setPosition(selection)
                }}>
                    {sortValues.map((item) => (
                        <DropdownMenuRadioItem key={item} value={item}>{item}</DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )

}