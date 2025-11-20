'use client';
import useNavigation from '@/modules/shared/hooks/use-navigation';
import useScrollingEffect from '@/modules/shared/hooks/use-scroll';
import Link from 'next/link';
import {Icon} from "@iconify/react";
import {useTRPC} from "@/trpc/client";
import {useQuery} from "@tanstack/react-query";
import {useSheet} from "@/lib/sheetContext";
import {COLOR_INPUT_PRIMARY, COLOR_INPUT_VARIANT} from "@/modules/home/constants";

const BottomNav = () => {

    const trpc = useTRPC()
    const session = useQuery(trpc.auth.session.queryOptions())

    const profileLink = session.data?.user ? "/profile" : "/sign-in";

    const scrollDirection = useScrollingEffect(); // Use the custom hook
    const navClass = scrollDirection === 'up' ? '' : 'opacity-25 duration-500';

    const { hasMessages, setHasMessages } = useSheet()

    const {
        activeTab
    } = useNavigation();

    return (
        <div
            className={`fixed bottom-0 w-full py-4 z-10 bg-zinc-100 dark:bg-zinc-950 border-t dark:border-zinc-800 border-zinc-200 shadow-lg lg:hidden ${navClass}`}
        >
            <div className="flex flex-row justify-around items-center bg-transparent w-full">
                <Link href="/" className="flex items-center relative">
                    {activeTab === "home" ? (
                        <Icon icon="mingcute:search-3-fill" width="24" height="24" color={COLOR_INPUT_VARIANT}/>
                    ) : (
                        <Icon icon="mingcute:search-3-line" width="24" height="24" color={COLOR_INPUT_VARIANT}/>
                    )}
                </Link>
                <Link href="/favourite" className="flex items-center relative">
                    {activeTab === "favorite" ? (
                        <Icon icon="mingcute:heart-fill" width="24" height="24" color={COLOR_INPUT_PRIMARY}/>
                    ) : (
                        <Icon icon="mingcute:heart-line" width="24" height="24" color={COLOR_INPUT_PRIMARY}/>
                    )}
                </Link>
                <Link href="/chat"
                      className="flex items-center relative"
                      onClick={()=> {
                          setHasMessages(false)
                      }}
                >
                    {activeTab === "chat" ? (
                        <Icon icon="mingcute:message-4-fill" width="24" height="24" color={COLOR_INPUT_VARIANT}/>
                    ) : (
                        <Icon icon="mingcute:message-4-line" width="24" height="24" color={COLOR_INPUT_VARIANT}/>
                    )}
                </Link>
                {
                    hasMessages && (
                        <div className="fixed center ml-3 bottom-4 bg-input-primary border w-3 h-3 rounded-full"/>
                    )
                }
                <Link href="/referral" className="flex items-center relative">
                    {activeTab === "referral" ? (
                        <Icon icon="mingcute:link-fill" width="24" height="24" color={COLOR_INPUT_PRIMARY}/>
                    ) : (
                        <Icon icon="mingcute:link-line" width="24" height="24" color={COLOR_INPUT_PRIMARY}/>
                    )}
                </Link>
                <Link href={profileLink} className="flex items-center relative">
                    {activeTab === "profile" ? (
                        <Icon icon="mingcute:user-2-fill" width="24" height="24" color={COLOR_INPUT_VARIANT}/>
                    ) : (
                        <Icon icon="mingcute:user-2-line" width="24" height="24" color={COLOR_INPUT_VARIANT}/>
                    )}
                </Link>

            </div>
        </div>
    );



}

export default BottomNav;