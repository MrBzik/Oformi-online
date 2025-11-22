import {z} from "zod";

export const streamTgNotificationSchema = z.object({
    userId: z.string(),
    message: z.string(),
})

export const startChatUnauthorizedSchema = z.object({
    username: z.string().min(3, "Введите от 3-х символов")
})

export const registerChatUserSchema = z.object({
    username: z.string(),
    userId: z.string(),
})
