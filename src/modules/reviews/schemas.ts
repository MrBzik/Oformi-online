import {z} from "zod";

export const reviewSchema = z.object({
    rating: z.number().min(1, {message: "Необходимо указать рейтинг"}).max(5),
    description: z.string().min(1, {message: "Необходимо описание"})
})

export const reviewSubmitSchema = z.object({
    rating: z.number().min(1, {message: "Необходимо указать рейтинг"}).max(5),
    description: z.string().min(1, {message: "Необходимо описание"}),
    productId: z.string(),
})

export const reviewResponseSchema = z.object({
    response: z.string().min(1, {message: "Поле не должно быть пустым"})
})

export const reviewResponseSubmitSchema = z.object({
    reviewId: z.string(),
    response: z.string().min(1, {message: "Поле не должно быть пустым"})
})