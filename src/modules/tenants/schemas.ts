import {z} from "zod";

export const tenantCreateSchema = z.object({
    tenantName: z.string().min(4, "Введите название магазина от 4-х букв"),
    description: z.string().max(320, "Описание превышает 320 символов").nullable().optional(),
    tenantSlug: z.string()
        .min(4, "Введите название пути от 4-х букв латиницей без пробелов и спец символов")
        .regex(/^[A-Za-z]+$/, "Разрешены только латинские буквы (a-z, A-Z)")
})