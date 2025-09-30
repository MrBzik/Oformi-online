import {baseProcedure, createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {z} from "zod";
import {cookies as getCookies} from "next/dist/server/request/cookies";

export const refCookieName = "ref";
export const refSellerCookieName = "refSeller";

export const refRouter  = createTRPCRouter({
    addReferralCookie: protectedProcedure
        .input(
            z.object({
                refLink: z.string().optional().nullable()
            })
        ).mutation(async ({input, ctx}) => {

            if(!input.refLink || ctx.session.user){
                return;
            }
            const cookies = await getCookies();

            if(cookies.has(refCookieName)) {
                return;
            }

            cookies.set({
                name: refCookieName,
                value: input.refLink,
                httpOnly: true,
                path: '/',
            })
        }),

    addReferralSellerCookie: protectedProcedure
        .input(
            z.object({
                refLink: z.string().optional().nullable()
            })
        ).mutation(async ({input, ctx}) => {

            if(!input.refLink || ctx.session.user){
                return;
            }
            const cookies = await getCookies();

            if(cookies.has(refSellerCookieName)) {
                return;
            }

            cookies.set({
                name: refSellerCookieName,
                value: input.refLink,
                httpOnly: true,
                path: '/',
            })
        }),

    getReferralPercentage : baseProcedure.query(async ({ctx}) => {
        const refSetting = await ctx.payload.findGlobal({
            slug: "refSetting",
        })
        return {
            refPercent: refSetting.refPercent,
            refSellersPercent: refSetting.refSellersPercent
        }
    })
})

