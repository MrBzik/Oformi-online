import {baseProcedure, createTRPCRouter} from "@/trpc/init";
import {z} from "zod";
import {categoryLoader} from "@/modules/utils/categoriesLoader";
import {Tag} from "@/payload-types";

export const tagsRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(z.object({
            category: z.string().nullable().optional(),
        })).query(async ( { ctx, input }) => {
            const categories = await categoryLoader({payload: ctx.payload, category: input.category})

            const data = await ctx.payload.find({
                collection: "filterGroups",
                where: {
                    "category.slug" : {
                        in: categories,
                    }
                },
                pagination: false
            })

            return {
                ...data,
                docs: data.docs.map((doc) => ({
                    ...doc,
                    tags: doc.tags as Tag[]
                }))
            }
        })
})