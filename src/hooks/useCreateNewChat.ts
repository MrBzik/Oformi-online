import streamClient from "@/lib/stream";
import {toast} from "sonner";

export const useCreateNewChat = () => {
    const createNewChat = async ({
        members,
        createdBy
    }: { members: string[], createdBy: string }) => {
        const existingChannel = await streamClient.queryChannels(
            {
                type: "messaging",
                members: {$eq: members}
            },
            { created_at : -1},
            {limit: 1}
        )
        if (existingChannel.length > 0) {
            return existingChannel[0]
        }

        const channelId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`

        try {

            const channelData: {
                members: string[];
                created_by_id: string;
                name? : string
            } = {
                members,
                created_by_id: createdBy
            }

            const channel = streamClient.channel(
                "messaging",
                channelId,
                channelData
            )

            await channel.watch({
                presence: true
            })

            return channel;

        } catch (error){
            toast.message("Исполнитель не принимает сообщений")
            return null
        }
    }

    return createNewChat;
}