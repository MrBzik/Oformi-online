import {caller} from "@/trpc/server";
import {Tenant} from "@/payload-types";

const BackToSite = async () => {

    const session = await caller.auth.session();

    const isTenant = (session.user?.tenants?.length ?? 0) > 0;

    if(!isTenant) {
        return;
    }

    const tenant = session.user?.tenants?.[0]!.tenant as Tenant;

    return <h2>
        Управление магазином {tenant.name}
    </h2>
}

export default BackToSite;