import {z} from "zod";

export const questionSchema = z.object({
    question: z.string().min(1, {message: "Поле не должно быть пустым"})
})

export const questionSubmitSchema = z.object({
    question: z.string().min(1, {message: "Поле не должно быть пустым"}),
    productId: z.string(),
})

export const questionResponseSchema = z.object({
    response: z.string().min(1, {message: "Поле не должно быть пустым"})
})

export const questionResponseSubmitSchema = z.object({
    reviewId: z.string(),
    response: z.string().min(1, {message: "Поле не должно быть пустым"})
})