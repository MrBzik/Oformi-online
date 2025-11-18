'use client';
import useNavigation from '@/modules/shared/hooks/use-navigation';
import useScrollingEffect from '@/modules/shared/hooks/use-scroll';
import Link from 'next/link';
import {Icon} from "@iconify/react";
import {useTRPC} from "@/trpc/client";
import {useQuery, useSuspenseQuery} from "@tanstack/react-query";

const BottomNav = () => {

    const trpc = useTRPC()
    const session = useQuery(trpc.auth.session.queryOptions())

    const profileLink = session.data?.user ? "/profile" : "/sign-in";

    const scrollDirection = useScrollingEffect(); // Use the custom hook
    const navClass = scrollDirection === 'up' ? '' : 'opacity-25 duration-500';

    const {
        isHomeActive,
        isFavoriteActive,
        isReferralActive,
        isProfileActive
    } = useNavigation();

    return (
        <div
            className={`fixed bottom-0 w-full py-4 z-10 bg-zinc-100 dark:bg-zinc-950 border-t dark:border-zinc-800 border-zinc-200 shadow-lg lg:hidden ${navClass}`}
        >
            <div className="flex flex-row justify-around items-center bg-transparent w-full">
                <Link href="/" className="flex items-center relative">
                    {isHomeActive ? (
                        <Icon icon="mingcute:search-3-fill" width="32" height="32"/>
                    ) : (
                        <Icon icon="mingcute:search-3-line" width="32" height="32"/>
                    )}
                </Link>
                <Link href="/favourite" className="flex items-center relative">
                    {isFavoriteActive ? (
                        <Icon icon="mingcute:heart-fill" width="32" height="32"/>
                    ) : (
                        <Icon icon="mingcute:heart-line" width="32" height="32"/>
                    )}
                </Link>
                <Link href="/referral" className="flex items-center relative">
                    {isReferralActive ? (
                        <Icon icon="mingcute:link-fill" width="32" height="32"/>
                    ) : (
                        <Icon icon="mingcute:link-line" width="32" height="32"/>
                    )}
                </Link>
                <Link href={profileLink} className="flex items-center relative">
                    {isProfileActive ? (
                        <Icon icon="mingcute:user-2-fill" width="32" height="32"/>
                    ) : (
                        <Icon icon="mingcute:user-2-line" width="32" height="32"/>
                    )}
                </Link>

            </div>
        </div>
    );



}

export default BottomNav;