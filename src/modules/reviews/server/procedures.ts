import {baseProcedure, createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {z} from "zod";
import {TRPCError} from "@trpc/server";
import {DEFAULT_LIMIT_REVIEWS} from "@/constants";
import {Review, Tenant, User} from "@/payload-types";
import {generateTgReqUrl, sendTgMessage} from "@/modules/utils/generateTgReqUrl";
import {reviewResponseSchema, reviewResponseSubmitSchema, reviewSubmitSchema} from "@/modules/reviews/schemas";

export const reviewsRouter = createTRPCRouter({
    getOne: protectedProcedure
        .input(z.object({
            productId: z.string(),
        })).query(async ( { ctx, input }) => {

            if(!ctx.session.user?.id){
                return null;
            }

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

            const review = await ctx.payload.find({
                collection: "reviews",
                pagination: false,
                limit: 1,
                where: {
                    and : [
                        {
                            product: {
                                equals: product.id
                            }
                        },
                        {
                            user: {
                                equals: ctx.session.user.id
                            }
                        }
                    ]
                }
            })

            if(review.totalDocs === 0){
                return null;
            }

            return review.docs[0];
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

            const reviews = await ctx.payload.find({
                collection: "reviews",
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
                ...reviews,
                docs: reviews.docs as (Review & { user: User })[]
            }
        }),

    upsert: protectedProcedure
        .input(reviewSubmitSchema).mutation(async ({input, ctx}) => {

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

            const existingReviewsData = await ctx.payload.find({
                collection: "reviews",
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

            let fiveStarRating = product.fiveStarsRatings
            let fourStarRating = product.fourStarsRatings
            let threeStarRating = product.threeStarsRatings
            let twoStarRating = product.twoStarsRatings
            let oneStarRating = product.oneStarsRatings

            switch(input.rating){
                case 5: {
                    fiveStarRating += 1
                    break;
                }
                case 4: {
                    fourStarRating += 1
                    break;
                }
                case 3: {
                    threeStarRating += 1
                    break;
                }
                case 2: {
                    twoStarRating += 1
                    break;
                }
                case 1: {
                    oneStarRating += 1
                    break;
                }
            }

            let ratingSum = (fiveStarRating * 5) + (fourStarRating * 4) + (threeStarRating * 3) + (twoStarRating * 2) + oneStarRating;

            let ratingCount = product.ratingCount

            let result: Review

            const oldReview = existingReviewsData.totalDocs > 0

            if(oldReview){

                const existingReview = existingReviewsData.docs[0]!

                switch(existingReview.rating){
                    case 5: {
                        fiveStarRating -= 1;
                        ratingSum -= 5;
                        break;
                    }
                    case 4: {
                        fourStarRating -= 1;
                        ratingSum -= 4;
                        break;
                    }
                    case 3: {
                        threeStarRating -= 1;
                        ratingSum -= 3;
                        break;
                    }
                    case 2: {
                        twoStarRating -= 1;
                        ratingSum -= 2;
                        break;
                    }
                    case 1: {
                        oneStarRating -= 1;
                        ratingSum -= 1;
                        break;
                    }
                }

                result= await ctx.payload.update({
                    collection: "reviews",
                    id: existingReview!.id,
                    data: {
                        rating: input.rating,
                        description: input.description
                    },
                    req: {transactionID}
                })
            } else {
                ratingCount +=1;
                result = await ctx.payload.create({
                    collection: "reviews",
                    data: {
                        user: ctx.session.user.id,
                        product: product.id,
                        rating: input.rating,
                        description: input.description
                    },
                    req: {transactionID}
                })
            }

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
                const msg = `${oldReview ? "Обновлен" : "Добавлен"} отзыв на https://oformi.online. Услуга: ${product.name}. Оценка: ${input.rating}`
                await sendTgMessage(tgRequestLink, tgChatId, msg)
            }

            await ctx.payload.update({
                collection: "products",
                id: product.id,
                data: {
                    ratingCount: ratingCount,
                    totalRating: ratingSum / ratingCount,
                    fiveStarsRatings: fiveStarRating,
                    fourStarsRatings: fourStarRating,
                    threeStarsRatings: threeStarRating,
                    twoStarsRatings: twoStarRating,
                    oneStarsRatings: oneStarRating
                },
                req: {transactionID}
            })

            await ctx.payload.db.commitTransaction(transactionID)

            return result
        }),

    submitResponse: baseProcedure
        .input(reviewResponseSubmitSchema).mutation(async ({input, ctx}) => {
            await ctx.payload.update({
                collection: "reviews",
                id: input.reviewId,
                data: {
                    response: input.response
                }
            })
        })
})