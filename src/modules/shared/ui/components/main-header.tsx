import {cn} from "@/lib/utils";
import Link from "next/link";
import {EB_Garamond, Exo_2, Inter_Tight, Lora, Poppins, Roboto, Vollkorn} from "next/font/google";

const poppins = EB_Garamond({
    subsets:["latin"],
    weight: ["700"]
})

export const MainHeader = () => {
    return (
        <Link href="/" className="lg:pl-6 flex items-center shrink-0">
            <h1 className={cn("text-xl font-semibold", poppins.className)}>
                <span className="text-sky-600">О</span>
                <span>форми </span>
                <span className="text-input-primary">О</span>
                <span>нлайн</span>
            </h1>
        </Link>
    )
}

export const MainHeaderTwoLines = () => {
    return (
        <Link href="/" className="flex items-center">
            <h1 className={cn("text-base font-semibold leading-tight", poppins.className)}>
                <span className="text-sky-600">О</span>
                <span className="uppercase">форми </span>
                <br/>
                <span className="text-input-primary">О</span>
                <span className=" uppercase">нлайн</span>
            </h1>
        </Link>
    )
}