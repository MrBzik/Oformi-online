import {baseProcedure, createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {registerChatUserSchema, streamTgNotificationSchema} from "@/modules/stream/schemas";
import {generateTgReqUrl, sendTgMessage} from "@/modules/utils/generateTgReqUrl";
import {cookies as getCookies} from "next/dist/server/request/cookies";
import {generateCookie} from "@/modules/auth/utils";

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

            const cookies = await getCookies();

            const userName = cookies.get("chat-user-name")?.value

            const message = `Сообщение от ${ctx.session.user?.username || userName}: ${input.message}`

            await sendTgMessage(tgRequestLink, user.tgNotificationsChatId, message)
        }),

    registerChatUser: baseProcedure
        .input(registerChatUserSchema)
        .mutation(async ({ input }) => {

            await generateCookie({
                name: "chat-user-name",
                value: input.username,
                expireDays: 360
            })

            await generateCookie({
                name: "chat-user-id",
                value: input.userId,
                expireDays: 360
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