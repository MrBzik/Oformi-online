"use client"

import Link from "next/link";
import {generateTenantURL} from "@/lib/utils";
import Image from "next/image";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";

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


    return (
        <Link href={generateTenantURL(tenantSlug)} className="flex items-center gap-2">
            {data.image?.url && (
                <Image
                    src={data.image.url}
                    alt={tenantSlug}
                    className="rounded-full border shrink-0 size-[32px]"
                    width={32}
                    height={32}
                />
            )}
            <p className="text-xl underline">{data.name}</p>
        </Link>
    )
}