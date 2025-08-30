import {Poppins} from "next/font/google";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";

interface Props {
    label: "Войти" | "Зарегистрироваться";
    navDestination: "/sign-in" | "/sign-up";
}

const poppins = Poppins({
    subsets:["latin"],
    weight: ["700"]
})

export const AuthNavigation = ({
    label,
    navDestination
} : Props) => {
    return (
        <div className="flex items-center justify-between mb-8">
            <Link href="/">
                                <span className={cn(
                                    "text-2xl font-semibold", poppins.className
                                )}>
                                    Оформи онлайн
                                </span>
            </Link>
            <Button asChild variant="ghost" size="sm"
                    className="text-base border-none underline">
                <Link prefetch href={navDestination}>
                    {label}
                </Link>
            </Button>
        </div>
    )
}