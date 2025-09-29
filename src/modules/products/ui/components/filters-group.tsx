import {useState} from "react";
import {ChevronDownIcon, ChevronRightIcon} from "lucide-react";
import {Tag} from "@/payload-types";
import {Checkbox} from "@/components/ui/checkbox";

interface ProductFilterProps {
    title: string;
    filters: Tag[];
    onClick: (tag: string) => void;
    value: string[] | null;
}

export const FiltersGroup = ({
    title,
    filters,
    onClick,
    value
} : ProductFilterProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

    return (
        <div className="p-4 flex flex-col gap-2 border bg-card-primary rounded-lg">
            <div onClick={() => setIsOpen(!isOpen)}
                 className="flex items-center justify-between cursor-pointer">
                <p className="font-medium text-sm select-none">{title}</p>
                <Icon className="size-5"/>
            </div>
            {isOpen && (
                <div className="mt-2 space-y-2">
                    {
                        filters.map((tag) => (
                            <div key={tag.id}
                                 onClick={() => onClick(tag.name)}
                                 className="pe-0.5 flex items-center justify-between cursor-pointer select-none">
                                <p className="font-medium text-sm">{tag.name}</p>
                                <Checkbox
                                    checked={value?.includes(tag.name)}
                                    onCheckedChange={() => onClick(tag.name)}
                                />
                            </div>
                        ))
                    }
                </div>
            )}
        </div>
    )
}
