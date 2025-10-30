import {Button} from "@/components/ui/button";
import {signIn} from "next-auth/react";
import Image from "next/image";

export const ServicesSingInButton = () => {
    return (
        <Button
            variant="default"
            className="relative mb-20 flex items-center justify-center bg-white text-black hover:bg-gray-100"
            onClick={() => signIn()}
        >
            <Image src="/Yandex_icon.svg" alt="yandex login" className="absolute left-4" width={35} height={35}/>
            <Image src="/Google_icon.svg" alt="yandex login" className="absolute right-4" width={32} height={32}/>
            <span className="lg:hidden">
               Яндекс / Google
            </span>
            <span className="hidden lg:block">
               Войти через Яндекс или Google
            </span>
        </Button>
    )
}