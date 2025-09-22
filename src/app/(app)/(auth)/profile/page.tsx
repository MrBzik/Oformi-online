import {caller} from "@/trpc/server";
import Link from "next/link";
import {TenantRegistration} from "@/modules/tenants/ui/views/TenantRegistration";
import {PlainFooter} from "@/modules/shared/ui/components/plain-footer";
import {TgNotificationsSetup} from "@/modules/auth/ui/views/tg-notifications-setup";
import {Tenant} from "@/payload-types";
import {isSuperAdmin} from "@/lib/access";

export const dynamic = "force-dynamic";

const Page = async () => {

    const session = await caller.auth.session();

    const tenant = session.user?.tenants?.[0]?.tenant as Tenant | undefined;

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 flex flex-col gap-8 p-4 lg:p-16">
                <h1 className="font-semibold text-4xl">
                    Добро пожаловать, {session.user?.username}
                </h1>
                {
                    (tenant) ? (
                        (tenant.isVerified || isSuperAdmin(session.user)) ?
                            <Link href="/admin" className="underline cursor-pointer text-lg">
                                Перейти в настройки магазина
                            </Link> : <div className="text-muted-foreground">Ваш магазин на модерации</div>

                    ) : <TenantRegistration />
                }
                <TgNotificationsSetup/>
            </div>
            <PlainFooter/>
        </div>
    )
}

export default Page