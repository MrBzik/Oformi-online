"use client"

import {MessageCircleMore} from "lucide-react";
import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {
    Channel,
    ChannelHeader,
    ChannelList,
    MessageInput,
    MessageList,
    Thread,
    useChatContext,
    Window
} from "stream-chat-react";
import {ChannelFilters, ChannelSort} from "stream-chat";
import {useTRPC} from "@/trpc/client";
import {useMutation, useSuspenseQuery} from "@tanstack/react-query";
import {useSheet} from "@/lib/sheetContext";
import "stream-chat-react/dist/css/v2/index.css"
import {useCallback, useEffect} from "react";
import {ChatPrompt, ChatPromptReload, ChatPromptSignIn} from "@/modules/stream/ui/components/chat-prompt";

export const ChatsSidebar = () => {

    const { isOpen, openSheet, closeSheet, connected, hasMessages, setHasMessages, chatUserId } = useSheet()

    const trpc = useTRPC();
    const {data: session} = useSuspenseQuery(trpc.auth.session.queryOptions())

    const {channel, client} = useChatContext();

    const {data: chatUser} = useSuspenseQuery(trpc.stream.getChatUser.queryOptions())

    const getUnreadCount = useCallback(async () => {

        try {
            const response = await client.getUnreadCount();
            setHasMessages(response.total_unread_count > 0)
        } catch (e){
            console.error(e);
        }
    }, [client])


    useEffect(() => {
        if(!connected){
            return;
        }
        if(isOpen){
            return;
        }

        try {
            getUnreadCount()
        } catch (e){
            console.error(e);
        }

    }, [getUnreadCount, connected, isOpen]);

    const sendTgNotification = useMutation(trpc.stream.sendMessageNotification.mutationOptions())


    useEffect(() => {

        if (!client) return;

        let messageText = ""
        const newMessageHandler = client.on("message.new", (event) => {
            messageText = event.message?.text || ""
            setHasMessages((event.total_unread_count || 0) > 0)
        })

        const notificationHandler = client.on("notification.mark_read", (event) => {
            event.channel?.members?.map((member) => {
                if(member.user?.online == false){
                    const receiverId = member.user.id
                    sendTgNotification.mutate({
                        userId: receiverId,
                        message: messageText.trim()
                    })
                }
            })
        })

        const unreadMessagesHandler = client.on("notification.message_new", (event) => {
            setHasMessages((event.total_unread_count || 0) > 0)
        })

        return () => {
            newMessageHandler.unsubscribe()
            notificationHandler.unsubscribe()
            unreadMessagesHandler.unsubscribe()
        };
    }, [client]);

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
            <MessageCircleMore
                className="hidden lg:block fixed w-15 h-15 bottom-10 right-10 text-input-variant hover:text-indigo-500 cursor-pointer"
                onClick={() => {
                    openSheet()
                }}
            />

            {
                hasMessages && (
                    <div className="hidden lg:block fixed bottom-10 right-12 bg-input-primary border border-input-variant w-4 h-4 rounded-full"/>
                )
            }


            <Sheet
                open={isOpen}
                onOpenChange={(open) => {
                if(open) {openSheet()} else closeSheet()
            }}>
                <SheetContent
                    side="right"
                    className="p-0 transition-none hidden lg:block"
                >

                    <SheetHeader className="p-4 border-b">
                        <SheetTitle className="text-sm">
                            {client.user?.name}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-row h-full">
                        <div className="w-70">
                            {
                                (session.user || chatUser.userName || chatUserId) ? (
                                    <>
                                        {
                                            client.user?.online ? (
                                                <ChannelList
                                                    filters={filters}
                                                    options={options}
                                                    sort={sort}
                                                    EmptyStateIndicator={() => (
                                                        <ChatPrompt title="Пишите исполнителям в карточках услуг"
                                                                    description="Здесь будут отображаться ваши чаты"/>
                                                    )}
                                                />
                                            ) : (<ChatPromptReload/>)
                                        }
                                    </>

                                ) : (<ChatPromptSignIn/>)
                            }
                        </div>

                        {
                            (channel && client.user?.online) && (
                                <div className="w-[40vw] pb-20">
                                    <Channel>
                                        <Window>
                                            <ChannelHeader/>
                                            <MessageList />
                                            <MessageInput/>
                                        </Window>
                                        <Thread/>
                                    </Channel>
                                </div>
                            )
                        }
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )

}