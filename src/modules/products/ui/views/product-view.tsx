"use client"

import {useTRPC} from "@/trpc/client";
import {useMutation, useSuspenseInfiniteQuery, useSuspenseQuery} from "@tanstack/react-query";
import {cn, formatCurrency} from "@/lib/utils";
import {LoaderIcon} from "lucide-react";
import {useEffect, useState} from "react";
import {RichText} from "@payloadcms/richtext-lexical/react"
import {ProductOrderBtn} from "@/modules/products/ui/components/product-order-btn";
import {NoProductView} from "@/modules/products/ui/components/no-product";
import {ProductBreadcrumb} from "@/modules/products/ui/components/product-breadcrumb";
import {ReviewForm} from "@/modules/reviews/ui/components/review-form";
import {ProductCard} from "@/modules/products/ui/components/product-card";
import Link from "next/link";
import Image from "next/image";
import {imageNameToSrc} from "@/modules/utils/s3_url";
import {Tenant} from "@/payload-types";
import {ReviewItem} from "@/modules/reviews/ui/components/review-item";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import {ProductActiveButtons} from "@/modules/products/ui/components/product-favourite";
import {ProductReferralBtn} from "@/modules/products/ui/components/product-referral-btn";
import {ProductTags} from "@/modules/products/ui/components/product-tags";
import {ProductRatings} from "@/modules/products/ui/components/product-ratings";
import {QuestionForm} from "@/modules/questions/ui/components/question-form";
import {QuestionItem} from "@/modules/questions/ui/components/question-item";

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
    const {data: session} = useSuspenseQuery(trpc.auth.session.queryOptions())

    const {
        data: reviews,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useSuspenseInfiniteQuery(trpc.reviews.getMany.infiniteQueryOptions({
            productId: data.id,
        },
        {
            getNextPageParam : (lastPage) => {
                return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
            },
        }
    ))

    const {
        data: questions,
        hasNextPage : qHasNextPage,
        isFetchingNextPage : qIsFetchingNextPage,
        fetchNextPage: qFetchNextPage,
    } = useSuspenseInfiniteQuery(trpc.questions.getMany.infiniteQueryOptions({
            productId: data.id,
        },
        {
            getNextPageParam : (lastPage) => {
                return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
            },
        }
    ))

    const handleRefLink = useMutation(trpc.referral.addReferralCookie.mutationOptions({}))
    useEffect(() => {
        handleRefLink.mutate({refLink: refLink})
    }, []);

    const src = imageNameToSrc(data.image?.filename) || "";

    let isProductOwner = false

    if((session?.user?.tenants?.length || 0) > 0 ){
        const userTenant = session?.user?.tenants?.[0]?.tenant as Tenant
        if(userTenant.slug === tenantSlug){
            isProductOwner = true
        }
    }

    const [isReviewsTable, setIsReviewsTable] = useState(true)

    return (
        <div className="px-4">
            <div className="p-6 flex flex-col gap-4">
                <ProductBreadcrumb parentCategorySlug={data.category.parent?.slug} parentCategoryName={data.category.parent?.name} categorySlug={data.category.slug} categoryName={data.category.name} />
            </div>
            <div className="flex flex-col gap-6 gap-y-8 lg:gap-y-12">
                {data.isArchived && (
                    <NoProductView>
                        Услуга была убрана в архив
                    </NoProductView>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-6 gap-y-4">
                    <div className="col-span-4 border border-e-[3px] border-b-[3px] rounded-sm bg-card-primary">
                        <div className="p-8 flex flex-col gap-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-6">
                                <div className="relative aspect-square col-span-2 p-6">
                                    <Image
                                        src={src}
                                        fill
                                        alt={data.image?.alt || "product image"}
                                        className="object-cover w-full h-auto rounded-lg border border-muted-foreground brutal-hover-shadow transition-shadow"
                                    />
                                </div>
                                <div className="col-span-4 flex flex-col gap-y-4 pe-0 pt-8 lg:pt-0 lg:px-8">
                                    <div className="flex justify-between gap-x-4">
                                        <h2 className="text-2xl flex-1 font-medium">{data.name}</h2>
                                        <ProductActiveButtons productId={productId} isArchived={data.isArchived ?? false}/>
                                    </div>

                                    <div className="flex flex-col gap-4">
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
                                        {
                                            isProductOwner ? (
                                                <Link
                                                    className="text-lg underline text-input-variant"
                                                    href={`/admin/collections/products/${data.id}`}>Редактировать услугу</Link>
                                            ) : (
                                                <div className="flex flex-col gap-4">
                                                    <ProductOrderBtn productId={productId} isArchived={data.isArchived ?? false}/>
                                                    <ProductReferralBtn/>
                                                </div>
                                            )
                                        }

                                    </div>
                                </div>
                            </div>
                            <RichText data={data.description} className="leading-8"/>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className="h-full">
                            <div className="p-6">

                             <ProductTags tags={data.tags}/>
                            </div>
                            <div className="p-6">
                                <ProductRatings
                                    totalRating={data.totalRating}
                                    ratingCount={data.ratingCount}
                                    ratingDistribution={data.ratingDistribution}/>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    data.recommendProducts?.length > 0 && (
                        <div className="flex flex-col gap-y-8">
                            <h2>Продавец рекомендует</h2>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {data.recommendProducts?.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                }
                <div className="grid grid-cols-1 lg:grid-cols-6 ">
                    <div id="reviews" className="col-span-4 flex flex-col gap-y-8">
                        <div className="flex gap-6">
                            <h2
                                onClick={() => setIsReviewsTable(true)}
                                className={cn(isReviewsTable ? "" : "text-muted-foreground underline cursor-pointer")}>Отзывы</h2>
                            <h2
                                onClick={() => setIsReviewsTable(false)}
                                className={cn(!isReviewsTable ? "" :"text-muted-foreground underline cursor-pointer")}>Вопросы</h2>
                        </div>
                        {
                            !isProductOwner && (
                                <div className="col-span-4 w-full">
                                    {
                                        isReviewsTable ? (
                                            <ReviewForm productId={productId}/>
                                        ) : (
                                            <QuestionForm productId={productId}/>
                                        )
                                    }
                                </div>
                            )
                        }
                        {
                            isReviewsTable ? (
                                reviews.pages?.[0]?.docs.length ===0 ? (
                                    <p className="text-muted-foreground">
                                        У этой услуги пока нет отзывов
                                    </p>) : (
                                    <>
                                        <div className="space-y-4">
                                            {reviews.pages.flatMap((page) => page.docs).map((review) => (
                                                <ReviewItem
                                                    key={review.id}
                                                    review={review}
                                                    canResponse={isProductOwner}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex w-full justify-center">
                                            <InfiniteScroll isLoading={isFetchingNextPage} hasMore={hasNextPage} next={fetchNextPage}>
                                                {hasNextPage && <LoaderIcon className="my-14 h-8 w-8 animate-spin" />}
                                            </InfiniteScroll>
                                        </div>
                                    </>
                                )
                            ) : (
                                questions.pages?.[0]?.docs.length ===0 ? (
                                    <p className="text-muted-foreground">
                                        У этой услуги пока нет вопросов
                                    </p>) : (
                                    <>
                                        <div className="space-y-4">
                                            {questions.pages.flatMap((page) => page.docs).map((question) => (
                                                <QuestionItem
                                                    key={question.id}
                                                    question={question}
                                                    canResponse={isProductOwner}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex w-full justify-center">
                                            <InfiniteScroll isLoading={qIsFetchingNextPage} hasMore={qHasNextPage} next={qFetchNextPage}>
                                                {qHasNextPage && <LoaderIcon className="my-14 h-8 w-8 animate-spin" />}
                                            </InfiniteScroll>
                                        </div>
                                    </>
                                )
                            )
                        }
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