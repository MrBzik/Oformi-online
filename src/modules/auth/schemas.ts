import {z} from "zod";

export const loginSchema =  z.object({
    email: z.email(),
    password: z.string()
})

export const registerSchema = z.object({
    email: z.email("Некорректный формат почты"),
    password: z.string().min(5, "Пароль должен быть длиннее 5 символов"),
    username: z.string().min(5, "Название должно быть длиннее 5 символов")
})