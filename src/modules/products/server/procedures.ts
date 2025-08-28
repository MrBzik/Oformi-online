import {baseProcedure, createTRPCRouter} from "@/trpc/init";
import {z} from "zod";
import type {Sort, Where} from "payload";
import {sortValues} from "@/modules/products/search-params";
import {categoryLoader} from "@/modules/utils/categoriesLoader";
import {Category, Media, Review, Tenant, User} from "@/payload-types";
import {DEFAULT_LIMIT} from "@/constants";

export const productsRouter = createTRPCRouter({
    getOne: baseProcedure
        .input(z.object({
            id: z.string(),
        }))
        .query(async ({ctx, input}) => {
            const product = await ctx.payload.findByID({
                collection: "products",
                id: input.id,
                depth: 2
            })

            const reviews = await ctx.payload.find({
                collection: "reviews",
                pagination: false,
                populate: {
                  users: {
                      username: true
                  }
                },
                where: {
                    product: {
                        equals: input.id
                    }
                }
            })

            const reviewRating = reviews.docs.length > 0
                    ? reviews.docs.reduce((acc, review) => acc + review.rating, 0) / reviews.totalDocs
                    : 0

            const ratingDistribution: Record<number, number> = {
              5: 0,
              4: 0,
              3: 0,
              2: 0,
              1: 0,
            };

            if(reviews.totalDocs > 0) {
                reviews.docs.forEach((review) => {
                    const rating = review.rating;
                    ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
                });

                Object.keys(ratingDistribution).forEach((key) => {
                    const rating = Number(key);
                    const count = ratingDistribution[rating] || 0;
                    ratingDistribution[rating] = Math.round(
                        (count / reviews.totalDocs) * 100
                    )
                })
            }

            return {
                ...product,
                category: product.category as Category & { parent: Category | null },
                image: product.image as Media | null,
                cover: product.cover as Media | null,
                media: product.media as Media[] | [],
                tenant: product.tenant as Tenant & { image: Media | null },
                reviewRating,
                reviewCount: reviews.totalDocs,
                ratingDistribution,
                reviews : reviews.docs as (Review & { user: User })[]
            };
        }),

    getMany: baseProcedure
        .input(z.object({
            cursor: z.number().default(1),
            limit: z.number().default(DEFAULT_LIMIT),
            search: z.string().nullable().optional(),
            category: z.string().nullable().optional(),
            minPrice: z.string().nullable().optional(),
            maxPrice: z.string().nullable().optional(),
            tags: z.array(z.string()).nullable().optional(),
            sort: z.enum(sortValues).nullable().optional(),
            tenantSlug: z.string().nullable().optional(),
        })).query(async ( { ctx, input }) => {
            const where: Where = {
                isArchived: {
                    not_equals: true
                }
            };

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
                where["name"] = {
                    like: input.search,
                }
            }

            const data = await ctx.payload.find({
                collection: "products",
                depth: 2,
                where,
                sort,
                page: input.cursor,
                limit: input.limit
            })

            const dataWithSummarizedReviews = await Promise.all(
                data.docs.map(async (doc) => {
                    const reviewsData = await ctx.payload.find({
                        collection: "reviews",
                        pagination: false,
                        where : {
                            product: {
                                equals: doc.id
                            }
                        }
                    });

                    return {
                        ...doc,
                        reviewCount: reviewsData.totalDocs,
                        reviewRating: reviewsData.docs.length === 0 ? 0
                            : reviewsData
                            .docs
                            .reduce((acc, review) => acc + review.rating, 0) / reviewsData.totalDocs,
                    }
                })
            )

            return {
                ...data,
                docs: dataWithSummarizedReviews.map(doc => ({
                    ...doc,
                    image: doc.image as Media | null,
                    tenant: doc.tenant as Tenant & {image: Media | null},
                }))
            }
        })
})