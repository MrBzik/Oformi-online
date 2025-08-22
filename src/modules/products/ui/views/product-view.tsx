"use client"

import Image from "next/image";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {formatCurrency, generateTenantURL} from "@/lib/utils";
import Link from "next/link";
import {StarRating} from "@/components/star-rating";
import {StarIcon} from "lucide-react";
import {Fragment} from "react";
import {Progress} from "@/components/ui/progress";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {ProductOrder} from "@/modules/products/ui/components/product-order";

interface Props {
    productId: string;
    tenantSlug: string;
}

export const ProductView = ({productId, tenantSlug} : Props) => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.products.getOne.queryOptions({
        id: productId,
    }))

    return (
        <div className="px-4 lg:px-12 py-10">
            <div className="border border-e-[3px] border-b-[3px] rounded-sm bg-white">
                <div className="border-b">
                    <Carousel className="w-full max-w-xs">
                        <CarouselContent>
                            {
                                data.media?.map((image, index) => (
                                    <CarouselItem key={index}>
                                        <Image
                                            src={image?.url || "/placeholder.png"}
                                            alt={image.alt}
                                            className="object-contain"
                                            height={500}
                                            width={500}
                                        />
                                    </CarouselItem>
                                ))
                            }
                        </CarouselContent>
                        <CarouselPrevious className="hidden 2xl:flex" />
                        <CarouselNext className="hidden 2xl:flex" />
                    </Carousel>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-6">
                    <div className="col-span-4">
                        <div className="p-6">
                            <h1 className="text-4xl font-medium">{data.name}</h1>
                        </div>
                        <div className="border-y flex">
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
                                <div className="flex items-center gap-1">
                                    <StarRating
                                        rating={4}
                                        iconClassName="size-4"
                                        text="(4.4)"
                                    />
                                    <p className="text-base font-medium">
                                        {"(178)"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="block lg:hidden px-6 py-4 items-center justify-center border-b">
                            <div className="flex items-center gap-1">
                                <StarRating
                                    rating={4}
                                    iconClassName="size-4"
                                    text="(4.4)"
                                />
                                <p className="text-base font-medium">
                                    {"(178)"}
                                </p>
                            </div>
                        </div>
                        <div className="p-6">
                            {data.description ? (
                                <p>{data.description}</p>
                            ) : (
                                <p className="font-medium text-muted-foreground italic">
                                    Нет описания
                                </p>
                                )
                            }
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className="border-t lg:border-t-0 lg:border-l h-full">
                            <div className="flex flex-col gap-4 p-6 border-b">
                                <div className="flex flex-row items-center gap-2">
                                    <ProductOrder productId={productId}/>
                                </div>
                                <p className="text-center font-medium">
                                    {`Гарантия возврата в течение ${data.refundPolicy}`}
                                </p>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-medium">Отзывы</h3>
                                    <div className="flex items-center gap-x-1 font-medium">
                                        <StarIcon className="size-4 fill-black"/>
                                        <p>({5})</p>
                                        <p className="text-base">{5}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[auto_1fr_auto] gap-3 mt-4">
                                    {[5, 4, 3, 2, 1].map((stars) => (
                                        <Fragment key={stars} >
                                            <div className="font-medium">{stars}</div>
                                            <Progress value={((stars + 1) * 2)} className="h-[1lh]"/>
                                            <div className="font-medium">
                                                {(stars + 1) * 2}
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