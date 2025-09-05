import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {z} from "zod";
import {TRPCError} from "@trpc/server";
import {DEFAULT_LIMIT_PRODUCTS} from "@/constants";
import { Product} from "@/payload-types";

export const favouriteRouter  = createTRPCRouter({
    getOne: protectedProcedure
        .input(z.object({
            productId: z.string(),
        })).query(async ( { ctx, input }) => {

            if(ctx.session?.user){
                const orderData = await ctx.payload.find({
                    collection: "favourite",
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

    create: protectedProcedure
        .input(
            z.object({
                productId: z.string()
            })
        ).mutation(async ({input, ctx}) => {

            if(!ctx.session?.user){
                return
            }

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
            await ctx.payload.create({
                collection: "favourite",
                data : {
                    user: ctx.session.user,
                    product: product,
                }
            })

        }),

    remove: protectedProcedure
        .input(
            z.object({
                productId: z.string()
            })
        ).mutation(async ({input, ctx}) => {

            if(!ctx.session?.user){
                return
            }

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
            await ctx.payload.delete({
                collection: "favourite",
                where: {
                    and : [
                        {
                            user: {
                                equals: ctx.session.user
                            }
                        },
                        {
                            product: {
                                equals: product
                            }
                        }
                    ]
                }
            })
        }),

    getMany: protectedProcedure
        .input(z.object({
            cursor: z.number().default(1),
            limit: z.number().default(DEFAULT_LIMIT_PRODUCTS),
        })).query(async ( { ctx, input }) => {

            if(!ctx.session?.user){
                return null
            }

            const data = await ctx.payload.find({
                collection: "favourite",
                page: input.cursor,
                limit: input.limit,
                where: {
                    user: {equals: ctx.session?.user}
                }
            })

            return {
                ...data,
                docs: data.docs.map(doc => ({
                    ...doc,
                    product: doc.product as Product
                }))
            }
        })

})