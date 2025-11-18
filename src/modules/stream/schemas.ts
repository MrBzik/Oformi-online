import {z} from "zod";

export const streamTgNotificationSchema = z.object({
    userId: z.string(),
    message: z.string(),
})