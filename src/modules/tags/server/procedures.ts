import {baseProcedure, createTRPCRouter} from "@/trpc/init";
import {z} from "zod";
import {DEFAULT_LIMIT_TAGS} from "@/constants";
import type {Where} from "payload";
import {categoryLoader} from "@/modules/utils/categoriesLoader";

export const tagsRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(z.object({
            category: z.string().nullable().optional(),
            cursor: z.number().default(1),
            limit: z.number().default(DEFAULT_LIMIT_TAGS),
        })).query(async ( { ctx, input }) => {
            const where: Where = {};

            const categories = await categoryLoader({payload: ctx.payload, category: input.category})

            if(categories){
                where["category.slug"] = {
                    in: categories,
                }
            }

            const data = await ctx.payload.find({
                collection: "tags",
                where: where,
                page: input.cursor,
                limit: input.limit
            })

            return data
        })
})