import {baseProcedure, createTRPCRouter} from "@/trpc/init";
import {z} from "zod";
import type {Sort, Where} from "payload";
import {sortValues} from "@/modules/products/search-params";
import {categoryLoader} from "@/modules/utils/categoriesLoader";
import {Media} from "@/payload-types";
import {DEFAULT_LIMIT} from "@/constants";

export const productsRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(z.object({
            cursor: z.number().default(1),
            limit: z.number().default(DEFAULT_LIMIT),
            category: z.string().nullable().optional(),
            minPrice: z.string().nullable().optional(),
            maxPrice: z.string().nullable().optional(),
            tags: z.array(z.string()).nullable().optional(),
            sort: z.enum(sortValues).nullable().optional()
        })).query(async ( { ctx, input }) => {
            const where: Where = {};

            let sort: Sort = "-createdAt"

            if (input.sort === "популярные"){
                sort = "+createdAt"
            }

            if(input.sort === "по умолчанию") {
                sort = "name"
            }


            if(input.sort )

            if(input.minPrice){
                where.price = {
                    greater_than_equal: input.minPrice,
                }
            }

            if(input.maxPrice){
                where.price = {
                    ...where.price,
                    less_than_equal: input.maxPrice,
                }
            }

            const categories = await categoryLoader({payload: ctx.payload, category: input.category})

            if(categories){
                where["category.slug"] = {
                    in: categories,
                }
            }

            if (input.tags && input.tags.length > 0) {
                where["tags.name"] = {
                    in: input.tags
                };
            }

            const data = await ctx.payload.find({
                collection: "products",
                depth: 1,
                where,
                sort,
                page: input.cursor,
                limit: input.limit
            })

            return {
                ...data,
                docs: data.docs.map(doc => ({
                    ...doc,
                    image: doc.image as Media | null,
                }))
            }
        })
})