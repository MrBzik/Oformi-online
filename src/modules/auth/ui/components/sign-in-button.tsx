"use client"

import Link from "next/link";
import {useTRPC} from "@/trpc/client";
import {useQuery} from "@tanstack/react-query";

export const SignInButton = () => {

    const trpc = useTRPC()
    const session = useQuery(trpc.auth.session.queryOptions())
    
    return (
        <div className="hidden lg:flex lg:pr-6 ">
            <div
                    className="h-full text-lg border-0">
                {
                    session.data?.user ? (
                        <Link href="/profile" className="underline">
                            {session.data!.user.username}
                        </Link>
                    ) : (
                        <Link prefetch href="/sign-in" className="underline">
                            Войти
                        </Link>
                    )
                }
            </div>
        </div>
    )
}
