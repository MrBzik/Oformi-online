import {loadAuthToken} from "@/modules/auth/searchParams";
import {SearchParams} from "nuqs/server";
import {ResetPassword} from "@/modules/auth/ui/views/reset-password";

interface Props {
    searchParams: Promise<SearchParams>
}

const Page = async ( {searchParams} : Props ) => {

    const {token}= await loadAuthToken(searchParams);

    return (
        <ResetPassword token={token}/>
    )

}

export default Page