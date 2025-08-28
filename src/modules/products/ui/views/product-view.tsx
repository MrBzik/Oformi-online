"use client"

import Image from "next/image";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {cn, formatCurrency, generateTenantURL} from "@/lib/utils";
import Link from "next/link";
import {StarRating} from "@/components/star-rating";
import {StarIcon} from "lucide-react";
import {Fragment, useState} from "react";
import {Progress} from "@/components/ui/progress";
import {RichText} from "@payloadcms/richtext-lexical/react"
import {ProductOrder} from "@/modules/products/ui/components/product-order";
import {NoProductView} from "@/modules/products/ui/components/no-product";
import {ProductBreadcrumb} from "@/modules/products/ui/components/product-breadcrumb";
import {ReviewForm} from "@/modules/reviews/ui/components/review-form";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";

interface Props {
    productId: string;
    tenantSlug: string;
}

export const ProductView = ({productId, tenantSlug} : Props) => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.products.getOne.queryOptions({
        id: productId,
    }))

    const [isCopied, setIsCopied] = useState(false);

    return (
        <div className="px-4 lg:px-12 py-10">
            <div className="p-6 flex flex-col gap-4">
                <h1 className="text-4xl font-medium">{data.name}</h1>
                <ProductBreadcrumb parentCategorySlug={data.category.parent?.slug} parentCategoryName={data.category.parent?.name} categorySlug={data.category.slug} categoryName={data.category.name} />
            </div>
            <div className="border border-e-[3px] border-b-[3px] rounded-sm bg-card-primary">
                {data.isArchived && (
                    <NoProductView>
                        Услуга была убрана в архив
                    </NoProductView>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-6">
                    <div className="col-span-4">
                        <div className="border-b flex">
                            <div className="px-6 py-4 flex items-center justify-center border-r">
                                <div className="px-2 py-1 border bg-blue-400 w-fit">
                                    <p className="text-base font-medium">{formatCurrency(data.price)}</p>
                                </div>
                            </div>
                            <div className="px-6 py-4 flex items-center justify-center lg:border-r">
                                <Link href={generateTenantURL(tenantSlug)} className="flex items-center gap-2">
                                    {data.tenant.image?.url && (
                                        <Image
                                            src={data.tenant.image.url}
                                            alt={data.tenant.name}
                                            width={24}
                                            height={24}
                                            className="rounded-full border shrink-0 size-[24px]"
                                        />
                                    )}
                                    <p className="text-base underline font-medium">
                                        {data.tenant.name}
                                    </p>
                                </Link>
                            </div>
                            <div className="hidden lg:flex px-6 py-4 items-center justify-center">
                                <div className="flex items-center gap-2">
                                    <StarRating
                                        rating={data.reviewRating}
                                        iconClassName="size-4"
                                        text={`(${data.reviewRating})`}
                                    />
                                    <p className="text-base font-medium">
                                        {`(${data.reviewCount})`}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="block lg:hidden px-6 py-4 items-center justify-center border-b">
                            <div className="flex items-center gap-2">
                                <StarRating
                                    rating={data.reviewRating}
                                    iconClassName="size-4"
                                    text={`(${data.reviewRating})`}
                                />
                                <p className="text-base font-medium">
                                    {`(${data.reviewCount})`}
                                </p>
                            </div>
                        </div>
                        <div className="p-6">
                            {data.description ? (
                                <RichText data={data.description} />
                            ) : (
                                <p className="font-medium text-muted-foreground italic">
                                    Нет описания
                                </p>
                                )
                            }
                        </div>
                        <div className="p-6">
                            <ReviewForm productId={productId}/>
                        </div>
                        {
                            data.reviews.map((review) => (
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
                    <div className="col-span-2">
                        <div className="border-t lg:border-t-0 lg:border-l h-full">
                            <div className="flex flex-col gap-4 p-6 border-b">
                                <div className="flex flex-row items-center gap-2">
                                    <ProductOrder productId={productId} isArchived={data.isArchived ?? false}/>
                                </div>
                                <p className="text-center font-medium">
                                    {`Зарабатывай с программой лояльности:`}
                                </p>
                                <Button
                                    className={cn("flex-1 bg-orange-400")}
                                    onClick={() => {
                                        setIsCopied(true)
                                        navigator.clipboard.writeText(window.location.href)
                                        toast.success("Реферальная ссылка скопирована. Больше информации в личном кабинете")
                                        setTimeout(() => {
                                            setIsCopied(false)
                                        }, 1000)
                                    }}
                                    disabled={isCopied}
                                >
                                    {"Реферальная ссылка"}
                                </Button>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-medium">Отзывы</h3>
                                    <div className="flex items-center gap-x-1 font-medium">
                                        <StarIcon className="size-4 fill-black"/>
                                        <p>({data.reviewRating})</p>
                                        <p className="text-base">{data.reviewCount}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[auto_1fr_auto] gap-3 mt-4">
                                    {[5, 4, 3, 2, 1].map((stars) => (
                                        <Fragment key={stars} >
                                            <div className="font-medium">{stars}</div>
                                            <Progress
                                                value={data.ratingDistribution[stars]}
                                                className="h-[1lh]"/>
                                            <div className="font-medium">
                                                {data.ratingDistribution[stars]}%
                                            </div>
                                        </Fragment>
                                    ))}
                                </div>
                            </div>
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