import {Label} from "@/components/ui/label";
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
            <div className="flex flex-col gap-2">
                <Label className="font-medium text-base">
                    От
                </Label>
                <Input type="text" placeholder="0"
                value={minPrice ? formatAsCurrency(minPrice) : ""}
                onChange={handleMinPriceChange}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label className="font-medium text-base">
                    До
                </Label>
                <Input type="text" placeholder="∞"
                       value={maxPrice ? formatAsCurrency(maxPrice) : ""}
                       onChange={handleMaxPriceChange}
                />
            </div>
        </div>
    )
};