import {baseProcedure, createTRPCRouter} from "@/trpc/init";
import {z} from "zod";
import type {Sort, Where} from "payload";
import {Category} from "@/payload-types";
import {sortValues} from "@/modules/products/search-params";

export const productsRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(z.object({
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

            if(input.category){
                const categoriesData = await ctx.payload.find({
                    collection: "categories",
                    limit: 1,
                    depth: 1,
                    pagination: false,
                    where: {
                        slug: {
                            equals: input.category
                        }
                    }
                });

                const formattedData = categoriesData.docs.map((doc) => ({
                    ...doc,
                    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
                        ...(doc as Category),
                        subcategories: undefined
                    }))
                }))

                const subcategories = [];
                const parentCategory = formattedData[0];
                if (parentCategory) {
                    subcategories.push(
                        ...parentCategory.subcategories.map(
                            (subcategory) => subcategory.slug
                        )
                    )

                    where["category.slug"] = {
                        in: [parentCategory.slug, ...subcategories],
                    }
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
                sort
            })

            return data
        })
})