import {CircleCheckBig} from "lucide-react";
import {AuthNavigation} from "@/modules/auth/ui/components/auth-navigation";

const Page = async () => {

    return (
        <div className="flex flex-col gap-8 p-4 lg:p-16 h-screen">
            <AuthNavigation label="Войти" navDestination="/sign-in"/>
            <div className="flex flex-col items-center gap-2 flex-1 justify-center">
                <CircleCheckBig className="h-8 w-8 text-green-600"/>
                <h1 className="font-semibold text-4xl">
                    Остался один шаг!
                </h1>
                <p className="text-muted-foreground text-lg">
                    Мы отправили на вашу почту письмо с токеном подтверждения. Не забудьте проверить папку Спам.
                </p>
            </div>
        </div>
    )
}

export default Page