"use client"

import {useTRPC} from "@/trpc/client";
import {useQuery, useSuspenseQuery} from "@tanstack/react-query";
import {useCallback, useEffect} from "react";
import streamClient from "@/lib/stream";
import {createToken} from "@/actions/createToken";
import {Chat, Streami18n} from "stream-chat-react";

const i18nInstance = new Streami18n({
    language: "ru",
});

function UserSyncWrapper({children} : {children: React.ReactNode}) {

    const trpc = useTRPC();
    const {data: session} = useQuery(trpc.auth.session.queryOptions())

    const syncUser = useCallback(async () => {
        if(!session?.user?.id){
            return
        }
        const tokenProvider = async () => {
            return await createToken(session.user?.id || "");
        }

        try {
            await streamClient.connectUser({
                    id: session.user.id,
                    name: session.user.username
                },
                tokenProvider)
        } catch (err) {
            console.error(err);
        }

    }, [session])

    const disconnectUser = useCallback(async () => {
        try {
            await streamClient.disconnectUser();
        } catch (e){
            console.error(e);
        }
    }, [])

    useEffect(() => {
        try {
            if(session?.user){
                syncUser()
            } else {
                disconnectUser()
            }
        } catch (e) {
            console.log(e)
        }
        return () => {
            if(session?.user){
                disconnectUser()
            }
        }
    }, [session, syncUser, disconnectUser])

    return <>
        <Chat client={streamClient} i18nInstance={i18nInstance}>
            {children}
        </Chat>
    </>;
}

export default UserSyncWrapper;