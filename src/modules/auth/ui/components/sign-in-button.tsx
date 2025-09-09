"use client"

import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useTRPC} from "@/trpc/client";
import {useQuery} from "@tanstack/react-query";

export const SignInButton = () => {

    const trpc = useTRPC()
    const session = useQuery(trpc.auth.session.queryOptions())
    
    return (
        <div className="hidden lg:flex">
            <Button asChild variant="link"
                    className="h-full text-lg border-0">
                {
                    session.data?.user ? (
                        <Link href="/admin" className="underline">
                            {session.data!.user.username}
                        </Link>
                    ) : (
                        <Link prefetch href="/sign-in" className="underline">
                            Войти
                        </Link>
                    )
                }
            </Button>
        </div>
    )
}
