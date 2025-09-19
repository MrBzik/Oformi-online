"use client"

import Image from "next/image";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {imageNameToSrc} from "@/modules/utils/s3_url";

interface Props {
    tenantSlug: string;
}

export const TenantLink = ({
    tenantSlug
} : Props) => {

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.tenants.getOne.queryOptions({
        slug: tenantSlug
    }))

    const tenantImgSrc = imageNameToSrc(data.image?.url)

    return (
        <div className="flex gap-4 items-start">
            {tenantImgSrc && (
                <Image
                    src={tenantImgSrc}
                    alt={tenantSlug}
                    className="rounded-full border shrink-0 size-[32px]"
                    width={32}
                    height={32}
                />
            )}
            <p className="text-xl shrink-0">{data.name}</p>
            <p className="hidden lg:block rounded-md text-xl text-muted-foreground">
                · {data.description}
            </p>
        </div>
    )
}