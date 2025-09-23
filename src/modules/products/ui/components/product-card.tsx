import Link from "next/link";
import Image from "next/image";
import {StarIcon} from "lucide-react";
import "@/components/styles/brutal.css"
import {useRouter} from "next/navigation";
import {formatCurrency, generateTenantURL} from "@/lib/utils";
import {reviewCountToText} from "@/modules/utils/reviewsUtils";
import {Product} from "@/payload-types";
import {productsPopulated} from "@/modules/products/types";
import {imageNameToSrc} from "@/modules/utils/s3_url";


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
                <div className="h-full flex flex-col">
                    <div className="relative aspect-square">
                        <Image
                            alt={prod?.name}
                            fill
                            src={imgSrc}
                            className="object-cover brutal-hover-shadow transition-shadow border rounded-lg border-muted-foreground"/>
                    </div>
                    <div className="flex flex-col gap-2 pt-4 flex-1"
                    >

                        <div className="flex items-center gap-2 min-h-6" onClick={handleUserClick}>
                            {tenantImgSrc && (
                                <Image
                                    src={tenantImgSrc}
                                    alt={prod.tenant?.slug}
                                    width={24}
                                    height={24}
                                    className="rounded-full border shrink-0 size-[24px]"/>
                            )}
                            <h2 className="text-xs 2xl:text-sm font-medium line-clamp-1">{prod.name}</h2>
                        </div>
                        <div className="flex items-center gap-1">
                            <StarIcon className="size-3.5 fill-input-primary stroke-input-primary"/>
                            <span className="text-sm font-medium">
                                    {prod.totalRating}
                                </span>
                            <span className="text-sm text-muted-foreground">
                                    · {prod.ratingCount} {reviewCountToText(prod.ratingCount)}
                                </span>
                        </div>
                        <div className="flex flex-row gap-2 w-fit min-w-[60%] items-center justify-center border-[1px_4px_4px_1px] transition-shadow rounded-full bg-card-primary  px-2 text-input-variant hover:bg-green-200">
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