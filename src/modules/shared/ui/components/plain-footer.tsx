import {Poppins} from "next/font/google";
import Link from "next/link";
import {cn} from "@/lib/utils";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"]
})

export const PlainFooter = () => {
    return (
        <footer className="h-20 font-medium ">
            <div className="mx-auto flex items-center h-full px-4 lg:px-12">
                <Link href="/">
                    <span className={cn("text-lg font-semibold", poppins.className)}>
                        Оформи онлайн
                    </span>
                </Link>
            </div>
        </footer>
    )
}