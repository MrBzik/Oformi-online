import {StarIcon} from "lucide-react";
import {reviewCountToText} from "@/modules/utils/reviewsUtils";
import {Fragment} from "react";
import {Progress} from "@/components/ui/progress";
import Link from "next/link";

interface Props {
    totalRating: number;
    ratingCount: number;
    ratingDistribution: Record<number, number>
}

export const ProductRatings = ({
    totalRating,
    ratingCount,
    ratingDistribution
} : Props) => {
    return (
        <>
            <div className="flex items-center gap-1">
                <StarIcon className="size-3.5 fill-input-primary stroke-input-primary"/>
                <span className="text-sm font-medium">
                    {totalRating}
                </span>
                <span className="text-sm text-muted-foreground">
                    · {ratingCount} {reviewCountToText(ratingCount)}
                </span>
            </div>
            <div className="grid grid-cols-[auto_1fr_auto] gap-3 mt-4 2xl:pr-[30%]">
                {[5, 4, 3, 2, 1].map((stars) => (
                    <Fragment key={stars} >
                        <div className="font-medium">{stars}</div>
                        <Progress
                            value={ratingDistribution[stars]}
                            className="h-[0.8lh] border-muted-foreground"/>
                        <div className="font-medium">
                            {ratingDistribution[stars]}%
                        </div>
                    </Fragment>
                ))}
            </div>
            <Link href={"#reviews"} className="underline mt-6 block font-medium">
                <h4>
                    Читать отзывы
                </h4>
            </Link>
        </>
    )
}