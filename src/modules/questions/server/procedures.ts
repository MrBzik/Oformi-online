import {baseProcedure, createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {z} from "zod";
import {TRPCError} from "@trpc/server";
import {DEFAULT_LIMIT_REVIEWS} from "@/constants";
import {Question, Tenant, User} from "@/payload-types";
import {generateTgReqUrl, sendTgMessage} from "@/modules/utils/generateTgReqUrl";
import {questionResponseSubmitSchema, questionSubmitSchema} from "@/modules/questions/schemas";

export const questionsRouter = createTRPCRouter({

    getWaitTime: protectedProcedure
        .input(z.object({
            productId: z.string(),
        })).query(async ( { ctx, input }) => {

            if(!ctx.session.user){
                return 0
            }

            const lastQuestionData = await ctx.payload.find({
                collection: "questions",
                limit: 1,
                pagination: false,
                where : {
                    and : [
                        {
                            user: {
                                equals: ctx.session.user.id
                            }
                        },
                        {
                            product: {
                                equals: input.productId
                            }
                        }
                    ]
                },
                sort: "-createdAt"
            })

            if(lastQuestionData.docs.length === 0){
                return 0;
            }

            const lastQuestion = lastQuestionData.docs[0]!;

            const created = new Date(lastQuestion.createdAt);
            const now = new Date();
            const diffMs = now.getTime() - created.getTime();
            const sixtyMinutes = 60 * 60 * 1000;
            if (diffMs < sixtyMinutes) {
                const remainingMs = sixtyMinutes - diffMs;
                return Math.ceil(remainingMs / (60 * 1000));
            } else {
                return 0;
            }

        }),

    getMany: baseProcedure
        .input(z.object({
            productId: z.string(),
            cursor: z.number().default(1),
            limit: z.number().default(DEFAULT_LIMIT_REVIEWS),
        })).query(async ( { ctx, input }) => {

            const product = await ctx.payload.findByID({
                collection: "products",
                id: input.productId
            })

            if (!product){
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Услуга не найдена"
                })
            }

            const questions = await ctx.payload.find({
                collection: "questions",
                page: input.cursor,
                limit: input.limit,
                populate: {
                    users: {
                        username: true
                    }
                },
                where: {
                    product: {
                        equals: product.id
                    }
                }
            })

            return {
                ...questions,
                docs: questions.docs as (Question & { user: User })[]
            }
        }),

    create: protectedProcedure
        .input(questionSubmitSchema).mutation(async ({input, ctx}) => {

            if(!ctx.session.user?.id){
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Не авторизован"
                })
            }

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
                    message: "Услуга не найдена."
                })
            }

            const existingQuestionData = await ctx.payload.find({
                collection: "questions",
                pagination: false,
                limit: 1,
                where: {
                    and: [
                        {
                            product: {equals: input.productId}
                        },
                        {
                            user: {equals: ctx.session.user.id}
                        }
                    ]
                },
                req: {transactionID}
            })

            if(existingQuestionData.docs.length > 0){

            }


            const result = await ctx.payload.create({
                collection: "questions",
                data: {
                    user: ctx.session.user.id,
                    product: product.id,
                    question: input.question
                },
                req: {transactionID}
            })

            const refSetting = await ctx.payload.findGlobal({
                slug: "refSetting"
            })
            const tgRequestLink = generateTgReqUrl(refSetting.alertsTgBotToken)

            const tenant = product.tenant as Tenant

            const productOwnerUser = await ctx.payload.find({
                collection: "users",
                where: {
                    "tenants.tenant": {
                        equals: tenant.id,
                    },
                },
                limit: 1,
                pagination: false
            })

            const tgChatId = productOwnerUser.docs[0]!.tgNotificationsChatId
            if(tgChatId){
                const msg = `Задан вопрос на https://oformi.online. Услуга: ${product.name}. Вопрос: ${input.question}`
                await sendTgMessage(tgRequestLink, tgChatId, msg)
            }


            await ctx.payload.db.commitTransaction(transactionID)

            return result
        }),

    submitResponse: baseProcedure
        .input(questionResponseSubmitSchema).mutation(async ({input, ctx}) => {
            await ctx.payload.update({
                collection: "questions",
                id: input.reviewId,
                data: {
                    response: input.response
                }
            })
        })
})