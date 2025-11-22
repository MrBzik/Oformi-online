import {baseProcedure, createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {registerChatUserSchema, streamTgNotificationSchema} from "@/modules/stream/schemas";
import {generateTgReqUrl, sendTgMessage} from "@/modules/utils/generateTgReqUrl";
import {cookies as getCookies} from "next/dist/server/request/cookies";

export const streamRouter = createTRPCRouter({

    sendMessageNotification: protectedProcedure
        .input(streamTgNotificationSchema)
        .mutation(async ({ input, ctx }) => {

            const user = await ctx.payload.findByID({
                collection: "users",
                id: input.userId
            })

            if(!user.tgNotificationsChatId){
                return
            }

            const refSetting = await ctx.payload.findGlobal({
                slug: "refSetting"
            })
            const tgRequestLink = generateTgReqUrl(refSetting.alertsTgBotToken)

            const message = `Сообщение от ${ctx.session.user?.username}: ${input.message}`

            await sendTgMessage(tgRequestLink, user.tgNotificationsChatId, message)
        }),

    registerChatUser: baseProcedure
        .input(registerChatUserSchema)
        .mutation(async ({ input }) => {
            const cookies = await getCookies();
            cookies.set({
                name: "chat-user-name",
                value: input.username,
                httpOnly: true,
                path: '/',
            })
            cookies.set({
                name: "chat-user-id",
                value: input.userId,
                httpOnly: true,
                path: '/',
            })
        }),

    getChatUser: baseProcedure
        .query(async () => {
            const cookies = await getCookies();
            const userName = cookies.get("chat-user-name")?.value
            const userId = cookies.get("chat-user-id")?.value
            return {
                userName,
                userId
            }
        })
})