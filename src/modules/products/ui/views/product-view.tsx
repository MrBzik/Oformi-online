"use client"

import {useTRPC} from "@/trpc/client";
import {useMutation, useQuery, useSuspenseInfiniteQuery, useSuspenseQuery} from "@tanstack/react-query";
import {cn, formatCurrency} from "@/lib/utils";
import {StarRating} from "@/components/star-rating";
import {StarIcon} from "lucide-react";
import {Fragment, useEffect, useState} from "react";
import {Progress} from "@/components/ui/progress";
import {RichText} from "@payloadcms/richtext-lexical/react"
import {ProductOrder} from "@/modules/products/ui/components/product-order";
import {NoProductView} from "@/modules/products/ui/components/no-product";
import {ProductBreadcrumb} from "@/modules/products/ui/components/product-breadcrumb";
import {ReviewForm} from "@/modules/reviews/ui/components/review-form";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {reviewCountToText} from "@/modules/utils/reviewsUtils";
import {ProductCard} from "@/modules/products/ui/components/product-card";
import Link from "next/link";
import {ProductAddToFavourite} from "@/modules/products/ui/components/product-favourite";
import Image from "next/image";
import {imageNameToSrc} from "@/modules/utils/s3_url";

interface Props {
    productId: string;
    tenantSlug: string;
    refLink?: string
}

export const ProductView = ({
    refLink,
    productId,
    tenantSlug
} : Props) => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.products.getOne.queryOptions({
        id: productId,
    }))
    const {data: session} = useQuery(trpc.auth.session.queryOptions())

    const {data: reviews} = useSuspenseInfiniteQuery(trpc.reviews.getMany.infiniteQueryOptions({
        productId: data.id,
    },
        {
            getNextPageParam : (lastPage) => {
                return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
            }
        }))

    const [isCopied, setIsCopied] = useState(false);

    const handleRefLink = useMutation(trpc.referral.addReferralCookie.mutationOptions({}))
    useEffect(() => {
        handleRefLink.mutate({refLink: refLink})
    }, []);

    const src = imageNameToSrc(data.image?.filename) || "";

    return (
        <div className="px-4 lg:px-12 py-10">
            <div className="p-6 flex flex-col gap-4">
                <h1 className="text-4xl font-medium">{data.name}</h1>
                <ProductBreadcrumb parentCategorySlug={data.category.parent?.slug} parentCategoryName={data.category.parent?.name} categorySlug={data.category.slug} categoryName={data.category.name} />
            </div>
            <div className="flex flex-col gap-6">
                {data.isArchived && (
                    <NoProductView>
                        Услуга была убрана в архив
                    </NoProductView>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-6 gap-y-4">
                    <div className="col-span-4 border border-e-[3px] border-b-[3px] rounded-sm bg-card-primary">
                        <div className="p-6 flex flex-col gap-y-4">
                            <Image
                                src={src}
                                width={data.image?.width || 0}
                                height={data.image?.height || 0}
                                alt={data.image?.alt || "product image"}
                                className="object-contain w-full h-auto"
                            />

                            <RichText data={data.description} className="leading-8"/>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className="border-t lg:border-t-0 h-full ">
                            <div className="flex flex-col gap-4 p-6">
                                <div className="flex flex-row gap-4 items-center px-2 py-1">
                                    <span className="text-2xl font-medium">{formatCurrency(data.price)}</span>
                                    {
                                        data.oldPrice && (
                                            <span className="text-2xl text-muted-foreground line-through">
                                    {formatCurrency(data.oldPrice)}
                                </span>
                                        )
                                    }
                                </div>
                                <ProductOrder productId={productId} isArchived={data.isArchived ?? false}/>
                                <ProductAddToFavourite productId={productId} isArchived={data.isArchived ?? false}/>
                                <p className="font-medium">
                                    {`Зарабатывай с программой лояльности:`}
                                </p>
                                <Button
                                    className={cn("flex-1 bg-orange-400")}
                                    onClick={async () => {
                                        setIsCopied(true)
                                        navigator.clipboard.writeText(window.location.href + `/?ref=${session?.user?.id}`)
                                        toast.success("Реферальная ссылка скопирована. Больше информации в личном кабинете")
                                        setTimeout(() => {
                                            setIsCopied(false)
                                        }, 1000)
                                    }}
                                    disabled={isCopied || session?.user == null}
                                >
                                    {session?.user ? "Реферальная ссылка" : "Требуется авторизация"}
                                </Button>
                            </div>
                            <div className="p-6">
                                {
                                    data.tags?.length > 0 && (
                                        <div className="flex flex-col gap-2">
                                            <h4>Тэги:</h4>
                                            <div className="flex flex-row flex-wrap gap-2 text-sm">
                                                {data.tags?.map((tag) => (
                                                    <span
                                                        className="bg-card-primary p-2 rounded-lg"
                                                        key={tag.id}>
                                                        {tag.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-1">
                                    <StarIcon className="size-3.5 fill-black"/>
                                    <span className="text-sm font-medium">
                                    {data.totalRating}
                                </span>
                                    <span className="text-sm text-muted-foreground">
                                    · {data.ratingCount} {reviewCountToText(data.ratingCount)}
                                </span>
                                </div>
                                <div className="grid grid-cols-[auto_1fr_auto] gap-3 mt-4">
                                    {[5, 4, 3, 2, 1].map((stars) => (
                                        <Fragment key={stars} >
                                            <div className="font-medium">{stars}</div>
                                            <Progress
                                                value={data.ratingDistribution[stars]}
                                                className="h-[0.8lh]"/>
                                            <div className="font-medium">
                                                {data.ratingDistribution[stars]}%
                                            </div>
                                        </Fragment>
                                    ))}
                                </div>
                                <Link href={"#reviews"} className="underline mt-6 block text-xl font-medium">
                                    Читать отзывы
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    data.recommendProducts?.length > 0 && (
                        <>
                            <div className="pt-6">
                                <h2>Смотрите также</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                                {data.recommendProducts?.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>
                        </>
                    )
                }
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-x-4">
                    <div className="col-span-4">
                        <div className="col-span-4 w-full">
                            <div className="p-6">
                                <ReviewForm productId={productId}/>
                            </div>
                        </div>
                        <div id="reviews" className="border border-e-[3px] border-b-[3px] rounded-sm bg-card-primary">
                            <div className="p-6">
                                <h2>Отзывы</h2>
                            </div>
                            { reviews.pages?.[0]?.docs.length ===0 ? (
                                <p className="p-6 text-muted-foreground">
                                    У этой улсуги пока нет отзывов
                                </p>) :
                                reviews.pages.flatMap((page) => page.docs).map((review) => (
                                    <div
                                        key={review.id}
                                        className="p-6 flex flex-col gap-2 border-t">
                                        <div className="flex flex-row justify-between">
                                            <p className="font-semibold">{review.user.username}</p>
                                            <StarRating
                                                rating={review.rating}
                                                iconClassName="size-3"
                                            />
                                        </div>
                                        <p className="font-medium">{review.description}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const ProductViewLoading = () => {
    return (
        <div className="px-4 lg:px-12 py-10">
            <div className="border border-e-[3px] border-b-[3px] rounded-sm bg-white">
                <div className="h-[60vh] bg-neutral-200 rounded-lg animate-pulse"/>
            </div>
        </div>
        )
}