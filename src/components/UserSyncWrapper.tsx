"use client"

import {useTRPC} from "@/trpc/client";
import {useQuery, useSuspenseQuery} from "@tanstack/react-query";
import {useCallback, useEffect} from "react";
import streamClient from "@/lib/stream";
import {createToken} from "@/actions/createToken";
import {Chat, Streami18n} from "stream-chat-react";
import {useSheet} from "@/lib/sheetContext";
import {Media, Tenant} from "@/payload-types";
import {imageNameToSrc} from "@/modules/utils/s3_url";

const i18nInstance = new Streami18n({
    language: "ru",
});

function UserSyncWrapper({children} : {children: React.ReactNode}) {

    const trpc = useTRPC();
    const {data: session} = useQuery(trpc.auth.session.queryOptions())

    const {data: chatUser} = useQuery(trpc.stream.getChatUser.queryOptions())

    const { setConnected } = useSheet()

    const syncUser = useCallback(async () => {
        if(!session?.user?.id && !chatUser?.userId){
            return
        }
        const tokenProvider = async () => {
            return await createToken(session?.user?.id || chatUser?.userId || "");
        }

        let imageUrl : string | undefined = undefined

        const tenants = session?.user?.tenants as {
            tenant: Tenant
            id?: string | null
        }[] | null | undefined

        if(tenants && tenants.length > 0){
            const tenant = tenants[0]
            const i = tenant?.tenant.image
            if(i){
                const image = i as Media
                imageUrl = imageNameToSrc(image.filename) || undefined
            }
        }

        try {
            await streamClient.connectUser({
                    id: session?.user?.id || chatUser?.userId || "",
                    name: session?.user?.username || chatUser?.userName,
                    image: imageUrl
                },
                tokenProvider)
            setConnected(true)
        } catch (err) {
            console.error(err);
        }

    }, [session])

    const disconnectUser = useCallback(async () => {
        try {
            await streamClient.disconnectUser();
            setConnected(false)
        } catch (e){
            console.error(e);
        }
    }, [])

    useEffect(() => {
        try {
            if(session?.user || chatUser?.userName){
                syncUser()
            } else {
                disconnectUser()
            }
        } catch (e) {
            console.log(e)
        }
        return () => {
            if(session?.user || chatUser?.userName){
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