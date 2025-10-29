import {Button} from "@/components/ui/button";
import {signIn} from "next-auth/react";
import Image from "next/image";

export const YandexSingInButton = () => {
    return (
        <Button
            variant="default"
            className="relative mb-20 flex items-center justify-center bg-white text-black hover:bg-gray-100"
            onClick={() => signIn()}
        >
            <Image src="/Yandex_icon.svg" alt="yandex login" className="absolute left-4" width={35} height={35}/>
            Войти через Яндекс
        </Button>
    )
}