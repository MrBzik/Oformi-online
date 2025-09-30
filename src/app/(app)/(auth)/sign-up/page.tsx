import {SingUpView} from "@/modules/auth/ui/views/sing-up-view";
import {caller} from "@/trpc/server";
import {redirect} from "next/navigation";
import type {SearchParams} from "nuqs/server";
import {loadRefLink, loadSellerRefLink} from "@/modules/products/search-params";

export const dynamic = "force-dynamic";

interface Props {
    searchParams: Promise<SearchParams>
}

const Page = async ({searchParams} : Props) => {

    const refSellerParams = await loadSellerRefLink(searchParams)

    const session = await caller.auth.session();

    if(session.user){
        redirect("/")
    }


    return <SingUpView refLink={refSellerParams.refSeller}/>
}

export default Page