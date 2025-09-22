import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {z} from "zod";
import {TRPCError} from "@trpc/server";
import {cookies as getCookies} from "next/dist/server/request/cookies";
import {refCookieName} from "@/modules/referral/server/procedures";
import {Product, Tenant} from "@/payload-types";
import {generateTgReqUrl, sendTgMessage} from "@/modules/utils/generateTgReqUrl";

export const ordersRouter  = createTRPCRouter({
    getOne: protectedProcedure
        .input(z.object({
            productId: z.string(),
        })).query(async ( { ctx, input }) => {


            const cookies = await getCookies();

            const hasOrderCookie = cookies.has(`order-${input.productId}`)

            if(hasOrderCookie){
                return true
            }

            if(ctx.session?.user){
                const orderData = await ctx.payload.find({
                    collection: "orders",
                    limit: 1,
                    pagination: false,
                    where: {
                        and: [
                            {
                                product: {equals: input.productId}
                            },
                            {
                                user: {equals: ctx.session?.user}
                            }
                        ]
                    }
                })

                return !!orderData.docs[0];
            }

            return false;

        }),

    getForReferral: protectedProcedure.query(async ({ ctx }) => {

        const user = ctx.session?.user

        if(!user){
            return null;
        }

        const orders = await ctx.payload.find({
            collection: "orders",
            pagination: false,
            sort: "createdAt",
            where: {
                referral : {
                    equals: user.id
                }
            }
        })

        const refIncome = await ctx.payload.find({
            collection: "refIncome",
            pagination: false,
            sort: "date",
            where: {
                user: {
                    equals: user.id
                }
            }
        })

        const formatter = new Intl.DateTimeFormat("ru-RU", {
            year: "numeric",
            month: "long",
        });

        const combined: Record<string, { real: number; potential: number }> = {};

        let totalRealIncome = 0;
        let totalPotentialIncome = 0;

        for (const doc of refIncome.docs) {
            const yearMonth = formatter.format(new Date(doc.date));
            if (!combined[yearMonth]) {
                combined[yearMonth] = { real: 0, potential: 0 };
            }
            totalRealIncome += doc.income;
            combined[yearMonth].real += doc.income;
        }

        for (const doc of orders.docs) {
            const product = doc.product as Product;
            const yearMonth = formatter.format(new Date(doc.createdAt));
            if (!combined[yearMonth]) {
                combined[yearMonth] = { real: 0, potential: 0 };
            }
            const potentialIncome = product.price * doc.refPercentage! / 100;
            totalPotentialIncome += potentialIncome;
            combined[yearMonth].potential += potentialIncome;
        }

       const incomeList = Object.entries(combined).map(([month, income]) => ({
            month,
            ...income
        }))
        return {
            incomeList,
            totalRealIncome,
            totalPotentialIncome,
        }
    }),

    create: protectedProcedure
        .input(
            z.object({
                productId: z.string(),
                username: z.string(),
                email: z.string(),
                phone: z.string().optional().nullable(),
                telegram: z.string().optional().nullable(),
            })
        ).mutation(async ({input, ctx}) => {

            const transactionID = await ctx.payload.db.beginTransaction()

            if(transactionID === null){
                throw new TRPCError({code: "INTERNAL_SERVER_ERROR"})
            }

            const product = await ctx.payload.findByID({
                collection: "products",
                id: input.productId,
                req: {transactionID}
            })

            if (!product){
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Product not found."
                })
            }

            const cookies = await getCookies();

            if(cookies.has(`order-${input.productId}`)){
                return
            }

            const referral = ctx.session.user?.ref || cookies.get(refCookieName)?.value

            let refUser : string | null = null
            let refPercentage: number | null | undefined = null

            const refSetting = await ctx.payload.findGlobal({
                slug: "refSetting"
            })

            const tgRequestLink = generateTgReqUrl(refSetting.alertsTgBotToken)

            if(referral && referral !== ctx.session.user?.id){

                refUser = referral

                refPercentage = refSetting.refPercent!

                const user = await ctx.payload.findByID({
                    collection: "users",
                    id: referral
                })

                if(user.tgNotificationsChatId){
                    const msg = `Подана заявка на услугу от вашего реферала. Подробности на https://oformi.online/referral`
                    await sendTgMessage(tgRequestLink, user.tgNotificationsChatId, msg)
                }

                await ctx.payload.update({
                    collection: "users",
                    id: referral,
                    data: {
                        potentialRefIncome: user.potentialRefIncome + (product.price * refPercentage / 100)
                    },
                    req: {transactionID}
                })
            }

            cookies.set({
                name: `order-${input.productId}`,
                value: 'ordered',
                httpOnly: true,
                path: '/',
            })

            await ctx.payload.update({
                collection: "products",
                id: input.productId,
                data: {
                    totalOrders: product.totalOrders + 1
                },
                req: {transactionID}
            })

            const tenant = product.tenant as Tenant
            const tenantUser = await ctx.payload.find({
                collection: "users",
                where: {
                    "tenants.tenant": {
                        equals: tenant.id,
                    },
                },
                limit: 1,
                pagination: false
            })

            const tgChatId = tenantUser.docs[0]!.tgNotificationsChatId

            if(tgChatId){
                const msg = `Заявка на услугу с сайта https://oformi.online. Услуга: ${product.name}. Имя заказчика: ${input.username}. Почта: ${input.email}. ${input.phone ? "Моб. тел.: " + input.phone + ". " : ""}${input.telegram ? "Telegram link: " + input.telegram + "." : ""}`
                await sendTgMessage(tgRequestLink, tgChatId, msg)
            }

            const adminMessage = `Заявка. Услуга: ${product.name}. Магазин: ${tenant.name}. Реферал: ${refUser}`

            await Promise.all(
                refSetting.adminTgAccounts!.map( account =>
                    sendTgMessage(tgRequestLink, account.telegramId, adminMessage)
                )
            );

            await ctx.payload.create({
                collection: "orders",
                data : {
                    tenant: product.tenant,
                    user: ctx.session.user,
                    referral: refUser,
                    refPercentage: refPercentage,
                    product: product,
                    email: input.email,
                    username: input.username,
                    phone: input.phone,
                    telegram: input.telegram
                },
                req: {transactionID: transactionID}
            })

            await ctx.payload.db.commitTransaction(transactionID)

        })
})