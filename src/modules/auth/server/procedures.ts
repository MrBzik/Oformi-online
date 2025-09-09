import {baseProcedure, createTRPCRouter} from "@/trpc/init";
import {headers as getHeaders} from "next/headers";
import {TRPCError} from "@trpc/server";
import {forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema} from "@/modules/auth/schemas";
import {generateAuthCookie} from "@/modules/auth/utils";
import {z} from "zod";

export const authRouter = createTRPCRouter({
    session: baseProcedure.query(async ( { ctx }) => {
        const headers = await getHeaders()

        const session = await ctx.payload.auth({headers});

        return session;
    }),
    register: baseProcedure
        .input(
            registerSchema,
        )
        .mutation(async ({ input, ctx }) => {

            const userData = await ctx.payload.find({
                collection: "users",
                limit: 1,
                where : {
                    username: {
                        equals: input.username
                    }
                }
            });

            const existingUser = userData.docs[0]

            if(existingUser) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Пользователь с таким именем уже существует"
                });
            }

            const tenant = await ctx.payload.create({
                collection: "tenants",
                data: {
                    name: input.username,
                    slug: input.username
                }
            })

            await ctx.payload.create({
                collection: "users",
                data: {
                    email: input.email,
                    username: input.username,
                    password: input.password,
                    tenants: [
                        {
                            tenant: tenant.id
                        }
                    ]
                }
            });

            const data = await ctx.payload.login({
                collection: "users",
                data: {
                    email: input.email,
                    password: input.password,
                },
            })
            if (!data.token){
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Unauthorized",
                })
            }

            await generateAuthCookie({
                prefix: ctx.payload.config.cookiePrefix,
                value: data.token
            });

        }),
    login: baseProcedure
        .input(loginSchema)
        .mutation(async ({ input, ctx }) => {
            const data = await ctx.payload.login({
                collection: "users",
                data: {
                    email: input.email,
                    password: input.password
                }
            })
            if (!data.token){
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Unauthorized",
                })
            }

            await generateAuthCookie({
                prefix: ctx.payload.config.cookiePrefix,
                value: data.token
            });
            return data;
        }),

    verifyEmail: baseProcedure
        .input(z.object({token: z.string()}))
        .query(async ({ input, ctx}) => {

            const { token } = input;

            try {
                const isVerified = await ctx.payload.verifyEmail({
                    collection: "users",
                    token: token
                });

                if(!isVerified){
                    return {success: false};
                }

                return {success: true};
            } catch (error) {
                console.log(error);
                return {success: false};
            }
        }),

    forgotPassword: baseProcedure
        .input(forgotPasswordSchema)
        .mutation(async ({ input, ctx }) => {

            try {
                const token = await ctx.payload.forgotPassword({
                    collection: "users",
                    data: {
                        email: input.email
                    },
                })

                if(token === null || token === undefined){
                    return {success: false};
                }

                return {success: true};
            } catch (e) {
                console.log(e);
                return {success: false};
            }
        }),


    resetPassword: baseProcedure
        .input(resetPasswordSchema)
        .mutation(async ({ input, ctx }) => {

            await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: input.token,
                    password: input.password,
                }),
            });
        })


});