import {caller} from "@/trpc/server";
import Link from "next/link";
import {TenantRegistration} from "@/modules/tenants/ui/views/TenantRegistration";
import {TgNotificationsSetup} from "@/modules/auth/ui/views/tg-notifications-setup";
import {Tenant} from "@/payload-types";
import {isSuperAdmin} from "@/lib/access";
import {redirect} from "next/navigation";
import { BadgeCheck } from "lucide-react";
import {Footer} from "@/app/(app)/(home)/footer";

export const dynamic = "force-dynamic";

const Page = async () => {

    const session = await caller.auth.session();

    const tenant = session.user?.tenants?.[0]?.tenant as Tenant | undefined;

    if(!session.user) {
        redirect("/sign-up");
    }

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 flex flex-col gap-8 p-4 lg:p-16">
                <h1 className="font-semibold text-4xl">
                    Добро пожаловать, {session.user?.username}
                </h1>
                {
                    (tenant) ? (
                        (tenant.isVerified || isSuperAdmin(session.user)) ?
                            <div className="flex flex-col gap-4">
                                <Link href="/admin" className="underline cursor-pointer text-lg text-input-variant">
                                    В настройки магазина
                                </Link>
                                {
                                    tenant.isTrusted ? (
                                        <p>
                                            Статус вашего магазина -{" "}
                                            <span className="font-semibold text-green-600">проверенный{" "}</span>
                                            <BadgeCheck className="stroke-green-600 inline-block align-middle"/>
                                        </p>

                                    ) : (
                                        <p>
                                            Для получения статуса{" "}
                                            <span
                                                className="font-semibold text-green-600">
                                                проверенного{" "}
                                                <BadgeCheck className="stroke-green-600 inline-block align-middle"/>
                                            </span>{" "}
                                            магазина{" "}
                                            <Link href="https://t.me/MessageOoBot?start=verif" className="underline text-input-primary">обращайтесь сюда</Link>
                                        </p>
                                    )
                                }
                            </div> : <p className="text-muted-foreground">Ваш магазин на модерации. Подпишитесь на Telegram-уведомления ниже, чтобы получить сообщение об изменении статуса модерации.</p>

                    ) : <TenantRegistration />
                }
                <TgNotificationsSetup/>
            </div>
            <Footer/>
        </div>
    )
}

export default Page