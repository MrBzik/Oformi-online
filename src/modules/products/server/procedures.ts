import {baseProcedure, createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {z} from "zod";
import type {Sort, Where} from "payload";
import {sortValues} from "@/modules/products/search-params";
import {categoryLoader} from "@/modules/utils/categoriesLoader";
import {Category, Media, Product, Tag, Tenant} from "@/payload-types";
import {DEFAULT_LIMIT_PRODUCTS} from "@/constants";
import {ratingToPercentage} from "@/modules/utils/reviewsUtils";

export const productsRouter = createTRPCRouter({
    getOne: protectedProcedure
        .input(z.object({
            id: z.string(),
        }))
        .query(async ({ctx, input}) => {
            const product = await ctx.payload.findByID({
                collection: "products",
                id: input.id,
                depth: 3
            })

            const ratingDistribution: Record<number, number> = {
              5: ratingToPercentage(product.fiveStarsRatings, product.ratingCount),
              4: ratingToPercentage(product.fourStarsRatings, product.ratingCount),
              3: ratingToPercentage(product.threeStarsRatings, product.ratingCount),
              2: ratingToPercentage(product.twoStarsRatings, product.ratingCount),
              1: ratingToPercentage(product.oneStarsRatings, product.ratingCount),
            };

            return {
                ...product,
                category: product.category as Category & { parent: Category | null },
                image: product.image as Media | null,
                tenant: product.tenant as Tenant & { image: Media | null },
                tags: product.tags as Tag[],
                recommendProducts: product.recommendations?.map(el => {
                    return el.product as (Product & {image: Media | null; tenant: Tenant})
                })?.filter((p) => p?.isVerified === true && p.tenant.isVerified === true) || [],
                ratingDistribution,
            };
        }),

    getOneMeta: baseProcedure
        .input(z.object({
            id: z.string(),
        }))
        .query(async ({ctx, input}) => {
            return await ctx.payload.findByID({
                collection: "products",
                id: input.id,
                depth: 3
            })
        }),

    updateProductViews: baseProcedure
        .input(z.object({
            id: z.string(),
        }))
        .mutation(async ({ctx, input}) => {
            const product = await ctx.payload.findByID({
                collection: "products",
                id: input.id
            })

            await ctx.payload.update({
                collection: "products",
                id: input.id,
                data: {
                    views: (product.views || 0) + 1
                }
            })
        }),

    getMany: baseProcedure
        .input(z.object({
            cursor: z.number().default(1),
            limit: z.number().default(DEFAULT_LIMIT_PRODUCTS),
            search: z.string().nullable().optional(),
            category: z.string().nullable().optional(),
            minPrice: z.string().nullable().optional(),
            maxPrice: z.string().nullable().optional(),
            tags: z.array(z.string()).nullable().optional(),
            sort: z.enum(sortValues).nullable().optional(),
            tenantSlug: z.string().nullable().optional(),
        })).query(async ( { ctx, input }) => {
            const where: Where = {
                and: [
                    {
                        isArchived: {
                            not_equals: true
                        }
                    },
                    {
                        isVerified: {
                            equals: true
                        }
                    },
                    {
                        "tenant.isVerified": {
                            equals: true
                        }
                    }
                ]
            };

            let sort: Sort = "-totalOrders"

            if (input.sort === "дешевле"){
                sort = "price"
            } else if (input.sort === "дороже"){
                sort = "-price"
            } else if (input.sort === "по рейтингу"){
                sort = "-totalRating"
            } else if (input.sort === "проверенные") {
                sort = "-isTrusted"
            } else if (input.sort === "популярные"){
                sort = "-totalOrders"
            }


            if(input.minPrice){
                where.price = {
                    ...where.price,
                    greater_than_equal: input.minPrice,
                }
            }

            if(input.maxPrice){
                where.price = {
                    ...where.price,
                    less_than_equal: input.maxPrice,
                }
            }

            if(input.tenantSlug){
                where["tenant.slug"] = {
                    equals: input.tenantSlug,
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

            if(input.search){
                where.or = [
                    {
                      name: {
                          like: input.search
                      }
                    },
                    {
                        "keyWords.word" : {
                            like: input.search
                        }
                    }
                ]
            }

            const data = await ctx.payload.find({
                collection: "products",
                depth: 2,
                where,
                sort,
                page: input.cursor,
                limit: input.limit,
                populate: {
                    products: {}
                }
            })

            return {
                ...data,
                docs: data.docs.map(doc => ({
                    ...doc,
                    image: doc.image as Media | null,
                    tenant: doc.tenant as Tenant & {image: Media | null},
                }))
            }
        }),

    getSuggestions: baseProcedure
        .input(z.object({
            search: z.string().nullable().optional(),
        })).query(async ( { ctx, input }) => {

            if(!input.search || input.search.length < 1){
                return null
            }

            const data = await ctx.payload.find({
                    collection: "products",
                    depth: 2,
                    limit: 5,
                    pagination: false,
                    where: {
                        and: [
                            {
                                or: [
                                    {
                                        name: {
                                            like: input.search,
                                        },
                                    },
                                    {
                                        "keyWords.word": {
                                            like: input.search,
                                        },
                                    },
                                ],
                            },
                            {
                                isArchived: {
                                    not_equals: true
                                }
                            },
                            {
                                isVerified: {
                                    equals: true
                                }
                            },
                            {
                                "tenant.isVerified": {
                                    equals: true
                                }
                            }
                        ]
                    },
                    populate: {
                        products: {},
                        tenants: {},
                    }
                })

                return {
                    ...data,
                    docs: data.docs.map(doc => ({
                        ...doc,
                        category: doc.category as Category | null
                    }))
                }
            }
        )

})