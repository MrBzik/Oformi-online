import Link from "next/link";
import Image from "next/image";
import {StarIcon} from "lucide-react";
import "@/components/styles/brutal.css"
import {useRouter} from "next/navigation";
import {formatCurrency, generateTenantURL} from "@/lib/utils";
import {reviewCountToText} from "@/modules/utils/reviewsUtils";

interface ProductCardProps {
    id: string;
    name: string;
    imageUrl?: string | null;
    tenantSlug: string;
    tenantImageUrl?: string | null;
    reviewRating: number;
    reviewCount: number;
    price: number;
}

export const ProductCard = ({
    id,
    name,
    imageUrl,
    tenantSlug,
    tenantImageUrl,
    reviewRating,
    reviewCount,
    price,
} : ProductCardProps) => {

    const router = useRouter()

    const handleUserClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        router.push(generateTenantURL(tenantSlug))
    }

    return (
            <Link href={`${generateTenantURL(tenantSlug)}/products/${id}`}>
                <div className="brutal-hover-shadow transition-shadow border rounded-md bg-card-primary overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-square">
                        <Image
                            alt={name}
                            fill
                            src={imageUrl || "/placeholder.png"}
                            className="object-cover"/>
                    </div>
                    <div className="p-4 border-y flex flex-col gap-3 flex-1">
                            <h2 className="text-sm font-medium line-clamp-1">{name}</h2>
                        <div className="flex items-center gap-2" onClick={handleUserClick}>
                            {tenantImageUrl && (
                                <Image
                                    src={tenantImageUrl}
                                    alt={tenantSlug}
                                    width={24}
                                    height={24}
                                    className="rounded-full border shrink-0 size-[24px]"/>
                            )}
                            <p className="text-sm underline font-medium">{tenantSlug}</p>
                        </div>
                        {reviewCount > 0 && (
                            <div className="flex items-center gap-1">
                                <StarIcon className="size-3.5 fill-black"/>
                                <span className="text-sm font-medium">
                                    {reviewRating}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    · {reviewCount} {reviewCountToText(reviewCount)}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="p-4">
                        <div className="relative px-2 py-1 border bg-blue-400 w-fit">
                            <p className="text-sm font-medium">
                                {formatCurrency(price)}
                            </p>
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