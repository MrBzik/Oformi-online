import {caller} from "@/trpc/server";
import {CircleCheckBig, XCircle} from "lucide-react";
import {AuthNavigation} from "@/modules/auth/ui/components/auth-navigation";
import {loadAuthToken} from "@/modules/auth/searchParams";
import {SearchParams} from "nuqs/server";

interface Props {
    searchParams: Promise<SearchParams>
}

const Page = async ( {searchParams} : Props ) => {

    const {token}= await loadAuthToken(searchParams);

    const { success } = await caller.auth.verifyEmail({
        token: token ?? ""
    });

    if (!success) {
        return (
            <div className="flex flex-col gap-8 p-4 lg:p-16 h-screen">
                <AuthNavigation label="Войти" navDestination="/sign-in"/>
                <div className="flex flex-col items-center gap-2 flex-1 justify-center">
                    <div className="flex flex-col items-center gap-2 flex-1 justify-center">
                        <XCircle className="h-8 w-8 text-red-800"/>
                        <h1 className="font-semibold text-4xl">
                            Верификация не удалась
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Токен авторизации неверный.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8 p-4 lg:p-16 h-screen">
            <AuthNavigation label="Войти" navDestination="/sign-in"/>
            <div className="flex flex-col items-center gap-2 flex-1 justify-center">
                <CircleCheckBig className="h-8 w-8 text-green-600"/>
                <h1 className="font-semibold text-4xl">
                    Верификация прошла успешно
                </h1>
                <p className="text-muted-foreground text-lg">
                    Вы можете войти под своим аккаунтом.
                </p>
            </div>
        </div>
    )
}

export default Page