import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {LoaderIcon} from "lucide-react";
import {FiltersGroup} from "@/modules/products/ui/components/filters-group";

interface TagsFilterProps {
    value: string[] | null;
    onChange: (value: string[]) => void;
    category?: string
}


export const TagsFilter = ({
    value,
    onChange,
    category
} : TagsFilterProps) => {

    const trpc = useTRPC();
    const {
        data,
        isLoading,
    } = useSuspenseQuery(trpc.tags.getMany.queryOptions({
        category: category
    }))

    const onClick = (tag: string) => {
        if(value?.includes(tag)) {
            onChange(value?.filter((t) => t !== tag) || [])
        } else {
            onChange([...(value || []), tag])
        }
    }

    return (
        <div className="flex flex-col gap-4">
            {isLoading ? (
                <div className="flex items-center justify-center p-4">
                    <LoaderIcon className="size-4 animate-spin"/>
                </div>
            ) : (
                data?.docs.map((filter) => (
                    <FiltersGroup
                        value={value}
                        title={filter.name}
                        filters={filter.tags}
                        onClick={onClick}
                        key={filter.id}/>
                    )
                )
            )}
        </div>
    )
}
