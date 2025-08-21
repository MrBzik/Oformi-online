import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {z} from "zod";
import {TRPCError} from "@trpc/server";
import {cookies as getCookies} from "next/dist/server/request/cookies";

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

        }),

    create: protectedProcedure
        .input(
            z.object({
                productId: z.string(),
                productName: z.string(),
                username: z.string(),
                email: z.string(),
                phone: z.string().optional().nullable(),
                telegram: z.string().optional().nullable(),
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

            const cookies = await getCookies();

            if(cookies.has(`order-${input.productId}`)){
                return
            }

            cookies.set({
                name: `order-${input.productId}`,
                value: 'ordered',
                httpOnly: true,
                path: '/',
            })

            await ctx.payload.create({
                collection: "orders",
                data : {
                    name: input.productName,
                    user: ctx.session.user,
                    product: product,
                    email: input.email,
                    username: input.username,
                    phone: input.phone,
                    telegram: input.telegram
                }
            })

        })
})