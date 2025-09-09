import {caller} from "@/trpc/server";
import Link from "next/link";
import {TenantRegistration} from "@/modules/tenants/ui/views/TenantRegistration";
import {PlainFooter} from "@/modules/shared/ui/components/plain-footer";

export const dynamic = "force-dynamic";

const Page = async () => {

    const session = await caller.auth.session();

    const isTenant = (session.user?.tenants?.length ?? 0) > 0;

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 flex flex-col gap-8 p-4 lg:p-16">
                <h1 className="font-semibold text-4xl">
                    Добро пожаловать, {session.user?.username}
                </h1>
                {
                    !isTenant ? (
                        <TenantRegistration />
                    ) : (
                        <Link href="/admin" className="underline cursor-pointer text-lg">
                            Перейти в настройки магазина
                        </Link>
                    )
                }
            </div>
            <PlainFooter/>
        </div>
    )
}

export default Page