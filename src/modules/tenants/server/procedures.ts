import {baseProcedure, createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {z} from "zod";
import {TRPCError} from "@trpc/server";
import {Media, Tenant} from "@/payload-types";
import {tenantCreateSchema} from "@/modules/tenants/schemas";
import {generateTgReqUrl, sendTgMessage} from "@/modules/utils/generateTgReqUrl";

export const tenantsRouter = createTRPCRouter({
    getOne: baseProcedure
        .input(z.object({
            slug: z.string(),
        })).query(async ( { ctx, input }) => {

            const tenantsData = await ctx.payload.find({
                collection: "tenants",
                depth : 1,
                where: {
                    slug: {
                        equals: input.slug
                    }
                },
                limit: 1,
                pagination: false
            })

            const tenant = tenantsData.docs[0];

            if(!tenant) {
                throw new TRPCError({code: "NOT_FOUND", message: "No tenant found."});
            }

            return tenant as Tenant & {image: Media | null}
        }),

    create: protectedProcedure
        .input(tenantCreateSchema)
        .mutation(async ({ input, ctx }) => {

            if(!ctx.session.user){
                throw new TRPCError({code: "UNAUTHORIZED"})
            }

            const transactionID = await ctx.payload.db.beginTransaction()

            if(transactionID === null){
                throw new TRPCError({code: "INTERNAL_SERVER_ERROR"})
            }

            const tenant = await ctx.payload.create({
                collection: "tenants",
                req: {transactionID},
                data: {
                    name: input.tenantName,
                    slug: input.tenantSlug,
                    description: input.description,
                    category: input.category
                }
            })

            const refSetting = await ctx.payload.findGlobal({
                slug: "refSetting"
            })
            const adminMessage = `Добавлен новый магазин. Название: ${input.tenantName}`
            const tgRequestLink = generateTgReqUrl(refSetting.alertsTgBotToken)

            await Promise.all(
                refSetting.adminTgAccounts!.map( account =>
                    sendTgMessage(tgRequestLink, account.telegramId, adminMessage)
                )
            );

            await ctx.payload.update({
                collection: "users",
                req: {transactionID},
                id: ctx.session.user.id,
                data: {
                    tenants: [
                        {
                            tenant: tenant.id
                        }
                    ]
                }
            });

            await ctx.payload.db.commitTransaction(transactionID)

        })
})