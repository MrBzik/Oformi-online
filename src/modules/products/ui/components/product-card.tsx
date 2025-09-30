import Link from "next/link";
import Image from "next/image";
import {AlarmClock, BadgeCheck, ClockIcon, InfoIcon, StarIcon, TimerIcon} from "lucide-react";
import "@/components/styles/brutal.css"
import {useRouter} from "next/navigation";
import {cn, formatCurrency, formatDeadline, generateTenantURL} from "@/lib/utils";
import {reviewCountToText} from "@/modules/utils/reviewsUtils";
import {Product} from "@/payload-types";
import {productsPopulated} from "@/modules/products/types";
import {imageNameToSrc} from "@/modules/utils/s3_url";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";


interface ProductCardProps {
    product: Product
}

export const ProductCard = ({
    product,
} : ProductCardProps) => {

    const router = useRouter()

    const prod = productsPopulated(product);

    const handleUserClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        router.push(generateTenantURL(prod.tenant?.slug))
    }

    if(!prod.name){
        return null
    }

    const imgSrc = imageNameToSrc(prod.image?.filename) || "/placeholder.png";
    const tenantImgSrc = imageNameToSrc(prod.tenant?.image?.filename)

    return (
            <Link href={`${generateTenantURL(prod.tenant?.slug)}/products/${prod.id}`}>
                <div className="h-full w-full flex flex-col select-none">
                    <div className="relative aspect-square">
                        <Image
                            alt={prod?.name}
                            fill
                            src={imgSrc}
                            className="object-cover brutal-hover-shadow transition-shadow border rounded-lg border-muted-foreground"/>
                    </div>
                    <div className="flex flex-col gap-2 pt-4 flex-1"
                    >

                        <div className="flex items-center gap-2 h-10" onClick={handleUserClick}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Image
                                        src={tenantImgSrc || "/tenant.svg"}
                                        alt={prod.tenant?.slug}
                                        width={24}
                                        height={24}
                                        className={cn("rounded-full shrink-0 size-[24px]", tenantImgSrc && "border")}/>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {prod.tenant.name}
                                </TooltipContent>
                            </Tooltip>
                            <h2 className="text-xs 2xl:text-sm font-semibold line-clamp-2">{prod.name}</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <TimerIcon className="size-3.5"/>
                            <span className="text-sm">{formatDeadline(prod.deadlineMin, prod.deadlineMax)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <StarIcon className="size-3.5 fill-input-primary stroke-input-primary"/>
                            <span className="text-sm font-medium">
                                    {prod.totalRating}
                                </span>
                            <span className="text-sm text-muted-foreground">
                                    · {prod.ratingCount} {reviewCountToText(prod.ratingCount)}
                                </span>
                            {
                                prod.tenant.isTrusted && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <BadgeCheck className="size-5 shrink-0 stroke-green-500"/>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Проверенный продавец
                                        </TooltipContent>
                                    </Tooltip>
                                )
                            }
                        </div>
                        <div className="flex flex-row w-full lg:w-fit min-w-[60%] max-w-[100%] items-center justify-center border-[1px_4px_4px_1px] transition-shadow rounded-full bg-card-primary  px-2 text-input-variant hover:bg-green-200">
                            <div className="relative px-2 py-1 w-fit">
                            <span className="text-sm font-medium ">
                                {formatCurrency(prod.price)}
                            </span>
                            </div>
                            {
                                prod.oldPrice && (
                                    <span className="text-xs text-muted-foreground line-through">
                                    {formatCurrency(prod.oldPrice)}
                                </span>
                                )
                            }
                        </div>
                    </div>

                </div>
            </Link>
        )
};

export const ProductCardLoading = () => {
    return (
        <div className="w-full aspect-3/4 bg-neutral-200 rounded-lg animate-pulse"/>
    )
}