import {z} from "zod";

export const loginSchema =  z.object({
    email: z.email(),
    password: z.string()
})

export const forgotPasswordSchema =  z.object({
    email: z.email(),
})

export const resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(5, "Пароль должен быть длиннее 5 символов"),
})

export const registerSchema = z.object({
    email: z.email("Некорректный формат почты"),
    password: z.string().min(5, "Пароль должен быть длиннее 5 символов"),
    username: z.string().min(5, "Название должно быть длиннее 5 символов")
})

export const orderProductSchema = z.object({
    username: z.string("Введите от 3-х символов").min(3),
    email: z.email("Некорректный формат почты"),
    phone: z
        .string()
        .trim()
        .transform(val => (val === "" ? null : val)) // "" → null
        .nullable()
        .refine(
            val => val === null || /^\+?[1-9]\d{1,14}$/.test(val),
            "Некорректный формат номера"
        ),

    telegram: z
        .string()
        .trim()
        .transform(val => (val === "" ? null : val)) // "" → null
        .nullable()
        .refine(val => val === null || val.length >= 2, {
            message: "Минимум 2 символа",
        }),
})