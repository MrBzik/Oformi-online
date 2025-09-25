import {Input} from "@/components/ui/input";
import {ChangeEvent} from "react";

interface Props {
    minPrice? : string | null;
    maxPrice? : string | null;
    onMinPriceChange: (value: string) => void;
    onMaxPriceChange: (value: string) => void;
}

export const formatAsCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if(!numericValue) return "";
    const numberValue = parseInt(numericValue);
    if(isNaN(numberValue)) return "";

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: "RUB",
        maximumFractionDigits: 0,
    }).format(numberValue);
}

export const PriceFilter = ({
    minPrice,
    maxPrice,
    onMinPriceChange,
    onMaxPriceChange,
} : Props) => {
    const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
      const numericValue = e.target.value.replace(/[^0-9]/g, '');
      onMinPriceChange(numericValue);
    };
    const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const numericValue = e.target.value.replace(/[^0-9]/g, '');
        onMaxPriceChange(numericValue);
    };

    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm ">Цена</span>
            <div className="flex gap-2">
                <Input
                    type="text"
                    placeholder="От 0"
                    className="md:text-sm sm:text-xs lg:text-xs h-10 border-muted-foreground"
                    value={minPrice ? formatAsCurrency(minPrice) : ""}
                    onChange={handleMinPriceChange}
                />
                <Input
                    type="text"
                    placeholder="До ∞"
                    className="md:text-sm sm:text-xs lg:text-xs h-10 border-muted-foreground"
                    value={maxPrice ? formatAsCurrency(maxPrice) : ""}
                    onChange={handleMaxPriceChange}
                />
            </div>
            <div className="flex flex-col gap-2">

            </div>
        </div>
    )
};