import {baseProcedure, createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {z} from "zod";
import {TRPCError} from "@trpc/server";
import {DEFAULT_LIMIT_REVIEWS} from "@/constants";

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

            return await ctx.payload.find({
                collection: "reviews",
                page: input.cursor,
                limit: input.limit,
                where: {
                    product: {
                        equals: product.id
                    }
                }
            })
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

            if(existingReviewsData.totalDocs > 0){

                const existingReview = existingReviewsData.docs[0]

                return await ctx.payload.update({
                    collection: "reviews",
                    id: existingReview!.id,
                    data: {
                        rating: input.rating,
                        description: input.description
                    }
                })
            }

            return await ctx.payload.create({
                collection: "reviews",
                data: {
                    user: ctx.session.user.id,
                    product: product.id,
                    rating: input.rating,
                    description: input.description
                }
            })
        })
})