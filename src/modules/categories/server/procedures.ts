import {baseProcedure, createTRPCRouter} from "@/trpc/init";
import {Category} from "@/payload-types";
import {z} from "zod";

export const categoriesRouter = createTRPCRouter({

    getOne: baseProcedure
        .input(z.object({
            slug: z.string(),
        }))
        .query(async ({ctx, input}) => {
            const result = await ctx.payload.find({
                collection: "categories",
                where: {
                    slug: {
                        equals: input.slug
                    }
                },
                limit: 1,
                pagination: false
            })
            return result.docs[0]

        }),

    getMany: baseProcedure.query(async ( { ctx }) => {

        const data = await ctx.payload.find({
            collection: "categories",
            pagination: false,
            where: {
                parent: {
                    exists: false
                }
            },
            sort: "createdAt"
        })

        const formattedData = data.docs.map((doc) => ({
            ...doc,
            subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
                ...(doc as Category),
            }))
        }))

        return formattedData
    })
})