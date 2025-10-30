import NextAuth from "next-auth"
import Yandex from "next-auth/providers/yandex";
import {getPayload} from "payload";
import config from "@payload-config"
import {cookies as getCookies} from "next/dist/server/request/cookies";
import {refCookieName} from "@/modules/referral/server/procedures";
import {generateAuthCookie} from "@/modules/auth/utils";
import Google from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        Yandex({
        clientId: process.env.YANDEX_CLIENT_ID!,
        clientSecret: process.env.YANDEX_CLIENT_SECRET!,
        authorization: {
            params: {
                scope: "login:email login:info"
            }
        },
        profile(profile) {
            return {
                id: profile.id,
                name: profile.first_name || profile.display_name || null,
                email: profile.default_email || profile.emails?.[0] || null,
            }
        }
    }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            profile(profile){
                return {
                    id: crypto.randomUUID(),
                    name: profile.name,
                    email: profile.email
                }
            }
        })
    ],
    callbacks: {
        async signIn({user}) {
            console.log("SIGN IN")
            const payload = await getPayload({config});
            const existingUser = await payload.find({
                collection: "users",
                where: {
                    email: {
                        equals: user.email
                    }
                },
                limit: 1,
                pagination: false
            })

            const password = crypto.randomUUID()

            if(existingUser.docs.length === 0){
                const cookies = await getCookies();
                const refLink = cookies.get(refCookieName)?.value
                await payload.create({
                    collection: "users",
                    data: {
                        email: user.email!,
                        username: user?.name ?? "Пользователь",
                        password: password,
                        potentialRefIncome: 0,
                        _verified: true,
                        ref: refLink
                    }
                })
            }

            else {
                await payload.update({
                    collection: "users",
                    id: existingUser.docs?.[0]!.id,
                    data: {
                        password: password,
                        _verified: true
                    }
                })
            }

            const data = await payload.login({
                collection: "users",
                data: {
                    email: user.email!,
                    password: password
                }
            })
            if (!data.token){
                return true
            }

            await generateAuthCookie({
                prefix: payload.config.cookiePrefix,
                value: data.token
            });

            return true
        },
    }
})

export { handler as GET, handler as POST }