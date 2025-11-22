"use client"

import {useSheet} from "@/lib/sheetContext";
import {
    Channel,
    ChannelHeader,
    ChannelList,
    MessageInput,
    MessageList,
    useChatContext,
    Window
} from "stream-chat-react";
import {ChatPrompt, ChatPromptReload, ChatPromptSignIn} from "@/modules/stream/ui/components/chat-prompt";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {ChannelFilters, ChannelSort} from "stream-chat";
import {MoveLeft} from "lucide-react";
import "stream-chat-react/dist/css/v2/index.css"

export const ChatsMobile = () => {

    const trpc = useTRPC();
    const {data: session} = useSuspenseQuery(trpc.auth.session.queryOptions())
    const { mobileInChannel, setMobileInChannel, chatUserId } = useSheet()
    const {channel, client} = useChatContext();
    const {data: chatUser} = useSuspenseQuery(trpc.stream.getChatUser.queryOptions())

    const filters: ChannelFilters = {
        members: { $in: [session.user?.id || chatUser?.userId || chatUserId || "" ] },
        type: {$in: ["messaging"]}
    }
    const options = { presence: true, state: true}
    const sort : ChannelSort = {
        last_message_at: -1
    }

    return (
        <>
            {
                mobileInChannel && channel && client.user?.online && (
                    <div className="pb-24 pt-12 h-[100vh]">
                        <Channel>
                            <Window>
                                <MessageList/>
                                <div className="fixed top-0 w-full bg-white flex flex-row items-center ps-2">
                                    <MoveLeft onClick={() => {
                                        setMobileInChannel(false)
                                    }}/>
                                    <ChannelHeader/>
                                </div>
                                <div className="fixed bottom-14 w-full">
                                    <MessageInput/>
                                </div>
                            </Window>
                        </Channel>
                    </div>
                )
            }
            {
                (!mobileInChannel || !channel) && (
                    <>
                        {
                            session.user || chatUser?.userName || chatUserId ? (
                                <>
                                    {
                                        client.user?.online ? (
                                            <div onClick={() => {
                                                setMobileInChannel(true)
                                            }}>
                                                <ChannelList
                                                    filters={filters}
                                                    options={options}
                                                    sort={sort}
                                                    EmptyStateIndicator={() => (
                                                        <ChatPrompt title="Пишите исполнителям в карточках услуг"
                                                                    description="Здесь будут отображаться ваши чаты"/>
                                                    )}
                                                />
                                            </div>
                                        ) : (<ChatPromptReload/>)
                                    }
                                </>

                            ) : (<ChatPromptSignIn/>)
                        }
                    </>
                )
            }
        </>
    )
}
