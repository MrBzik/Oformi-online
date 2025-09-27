import {Tag} from "@/payload-types";

interface Props {
    tags: Tag[]
}

export const ProductTags = ({
    tags
} : Props) => {
    return (
        tags?.length > 0 && (
            <div className="flex flex-col gap-2">
                <h4>Характеристики:</h4>
                <div className="flex flex-row flex-wrap gap-2 text-sm">
                    {tags?.map((tag) => (
                        <span
                            className="bg-card-primary p-2 rounded-lg"
                            key={tag.id}>
                            {tag.name}
                        </span>
                    ))}
                </div>
            </div>
        )
    )
}