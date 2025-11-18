import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {streamTgNotificationSchema} from "@/modules/stream/schemas";
import {generateTgReqUrl, sendTgMessage} from "@/modules/utils/generateTgReqUrl";

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
        })


})