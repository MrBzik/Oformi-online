import {cn} from "@/lib/utils";
import Link from "next/link";
import {Poppins} from "next/font/google";

const poppins = Poppins({
    subsets:["latin"],
    weight: ["700"]
})

export const MainHeader = () => {
    return (
        <Link href="/" className="pl-6 flex items-center shrink-0">
            <h1 className={cn("text-xl font-semibold", poppins.className)}>
                <span className="text-sky-600">О</span>
                <span>форми </span>
                <span className="text-orange-500">О</span>
                <span>нлайн</span>
            </h1>
        </Link>
    )
}