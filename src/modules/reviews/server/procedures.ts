import {baseProcedure, createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {z} from "zod";
import {TRPCError} from "@trpc/server";
import {DEFAULT_LIMIT_REVIEWS} from "@/constants";

export const reviewsRouter = createTRPCRouter({
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
                    message: "Product not found."
                })
            }

            const reviewsData = await ctx.payload.find({
                collection: "reviews",
                page: input.cursor,
                limit: input.limit,
                where: {
                    product: {
                        equals: product.id
                    }
                }
            })

            return reviewsData
        }),

    create: protectedProcedure
        .input(
            z.object({
                productId: z.string(),
                rating: z.number().min(1, {message: "Rating is required"}).max(5),
                description: z.string().min(0)
            })
        ).mutation(async ({input, ctx}) => {

            const product = await ctx.payload.findByID({
                collection: "products",
                id: input.productId
            })

            if (!product){
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Product not found."
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
                            user: {equals: ctx.session?.user}
                        }
                    ]
                }
            })
        })
})