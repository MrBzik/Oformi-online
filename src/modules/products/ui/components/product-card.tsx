import Link from "next/link";
import Image from "next/image";
import {StarIcon} from "lucide-react";
import "@/components/styles/brutal.css"
import {useRouter} from "next/navigation";
import {formatCurrency, generateTenantURL} from "@/lib/utils";
import {reviewCountToText} from "@/modules/utils/reviewsUtils";
import {Product} from "@/payload-types";
import {productsPopulated} from "@/modules/products/types";

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

        router.push(generateTenantURL(prod.tenant.slug))
    }

    if(!prod.name){
        return null
    }

    return (
            <Link href={`${generateTenantURL(prod.tenant.slug)}/products/${prod.id}`}>
                <div className="brutal-hover-shadow transition-shadow border rounded-md bg-card-primary overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-square">
                        <Image
                            alt={prod.name}
                            fill
                            src={prod.image?.url || "/placeholder.png"}
                            className="object-cover"/>
                    </div>
                    <div className="p-4 border-y flex flex-col gap-3 flex-1">
                            <h2 className="text-xs 2xl:text-sm font-medium line-clamp-1">{prod.name}</h2>
                        <div className="flex items-center gap-2" onClick={handleUserClick}>
                            {prod.tenant.image?.url && (
                                <Image
                                    src={prod.tenant.image?.url}
                                    alt={prod.tenant.slug}
                                    width={24}
                                    height={24}
                                    className="rounded-full border shrink-0 size-[24px]"/>
                            )}
                            <p className="text-sm underline font-medium">{prod.tenant.slug}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <StarIcon className="size-3.5 fill-black"/>
                            <span className="text-sm font-medium">
                                    {prod.totalRating}
                                </span>
                            <span className="text-sm text-muted-foreground">
                                    · {prod.ratingCount} {reviewCountToText(prod.ratingCount)}
                                </span>
                        </div>
                    </div>
                    <div className="p-4 flex flex-row gap-2 items-center">
                        <div className="relative px-2 py-1 border bg-blue-400 w-fit">
                            <span className="text-sm font-medium">
                                {formatCurrency(prod.price)}
                            </span>
                        </div>
                        {
                            prod.oldPrice && (
                                <span className="text-lg text-muted-foreground line-through">
                                    {formatCurrency(prod.oldPrice)}
                                </span>
                            )
                        }
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