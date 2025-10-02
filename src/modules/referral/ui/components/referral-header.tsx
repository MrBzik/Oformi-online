"use client"

import {toast} from "sonner";
import Link from "next/link";
import {cn} from "@/lib/utils";

interface Props {
    userId?: string,
    refPercentage: number,
    refSellarPercentage: number,
}

export const ReferralHeader = ({
    userId,
    refPercentage,
    refSellarPercentage,
} : Props) => {
    return (
        <div className="flex flex-col gap-y-4">
            {
                !userId && (
                    <div className="flex gap-x-1">
                        <Link href="/sign-in" className="cursor-pointer underline text-input-primary">Регистрируйся</Link>
                        <span>и начинай зарабатывать!</span>
                    </div>
                )
            }
            <p>
                Приглашай новых покупателей по{" "}
                <span
                    className={cn(userId && "underline text-input-primary cursor-pointer")}
                    onClick={() => {
                        if (userId) {
                            navigator.clipboard.writeText(`https:/oformi.online/?ref=${userId}`)
                            toast.success("Реферальная ссылка скопирована")
                        }
                    }}
                >
                    реферальной ссылке!
                </span>{" "}
                Зарабатывай {refPercentage}% с каждой продажи!
            </p>
            <p>
                Получай {refSellarPercentage}% с продаж{" "}
                <span
                    className={cn(userId && "underline text-input-primary cursor-pointer")}
                    onClick={() => {
                        if(userId){
                            navigator.clipboard.writeText(`https:/oformi.online/sing-up/?refSeller=${userId}`)
                            toast.success("Реферальная ссылка скопирована")
                        }
                    }}
                >приглашенных</span>{" "}
                продавцов в течении 3-х месяцев!
            </p>
            {
                userId && (
                    <p>
                        Не забудь подключить Telegram уведомления{" "}
                        <Link className="underline cursor-pointer text-input-variant" href="/profile">
                            здесь
                        </Link>
                    </p>
                )
            }
        </div>
    )
}