import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
    id: string;
    name: string;
    imageUrl?: string | null;
    authorUsername: string;
    authorImageUrl?: string | null;
    reviewRating: number;
    reviewCount: number;
    price: number;
}

export const ProductCard = ({
    id,
    name,
    imageUrl,
    authorUsername,
    authorImageUrl,
    reviewRating,
    reviewCount,
    price,
} : ProductCardProps) => {
    return (
            <Link href="/">
                <div className="border rounded-md bg-white overflow-hidden h-full flex flex-col">
                    <Image
                        alt={name}
                        fill
                        src={imageUrl || ""}
                        className="object-cover"/>

                </div>
            </Link>
        )

}