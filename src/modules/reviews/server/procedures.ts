import {baseProcedure, createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {z} from "zod";
import {TRPCError} from "@trpc/server";
import {DEFAULT_LIMIT_REVIEWS} from "@/constants";
import {Review, User} from "@/payload-types";

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

            return reviews.docs as (Review & { user: User })[]
        }),

    upsert: protectedProcedure
        .input(
            z.object({
                productId: z.string(),
                rating: z.number().min(1, {message: "Необходимо указать рейтинг"}).max(5),
                description: z.string().min(1, {message: "Необходимо описание"})
            })
        ).mutation(async ({input, ctx}) => {

            if(!ctx.session.user?.id){
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Не авторизован"
                })
            }

            const product = await ctx.payload.findByID({
                collection: "products",
                id: input.productId
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
                }
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

            if(existingReviewsData.totalDocs > 0){

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
                    }
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
                    }
                })
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
                }
            })

            return result
        })
})