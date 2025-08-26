"use client"

import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import {generateTenantURL} from "@/lib/utils";

interface Props {
    slug: string;
}

export const Navbar = ({
    slug
} : Props) => {

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.tenants.getOne.queryOptions({
        slug
    }))

    return (
        <nav className="h-20 font-medium bg-bg-secondary">
            <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
                <Link href={generateTenantURL(slug)} className="flex items-center gap-2">
                    {data.image?.url && (
                        <Image
                            src={data.image.url}
                            alt={slug}
                            className="rounded-full border shrink-0 size-[32px]"
                            width={32}
                            height={32}
                        />
                    )}
                    <p className="text-xl underline">{data.name}</p>
                </Link>
            </div>
        </nav>
    )
}

export const NavbarLoading = () => {
    return (
        <nav className="h-20 font-medium bg-bg-secondary">
            <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
                <div/>
            </div>
        </nav>
    )
}