"use client"

import {toast} from "sonner";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {refCookieName, refSellerCookieName} from "@/modules/referral/server/procedures";

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
            <div className="flex gap-x-1">
                <span>Приглашай новых покупателей по</span>
                <span
                    className={cn(userId && "underline text-input-primary cursor-pointer")}
                    onClick={() => {
                        if(userId){
                            navigator.clipboard.writeText(`https:/oformi.online/?${refCookieName}=${userId}`)
                            toast.success("Реферальная ссылка скопирована")
                        }
                    }}
                >реферальной ссылке!</span>
                <span>Зарабатывай {refPercentage}% с каждой продажи!</span>
            </div>
            <div className="flex gap-x-1">
                <span>Получай {refSellarPercentage}% с продаж</span>
                <span
                    className={cn(userId && "underline text-input-primary cursor-pointer")}
                    onClick={() => {
                        if(userId){
                            navigator.clipboard.writeText(`https:/oformi.online/sing-up/?${refSellerCookieName}=${userId}`)
                            toast.success("Реферальная ссылка скопирована")
                        }
                    }}
                >приглашенных</span>
                <span>продавцов в течении 3-х месяцев!</span>
            </div>
            {
                userId && (
                    <div className="flex gap-x-1">
                        <span>Не забудь подключить Telegram уведомления</span>
                        <Link className="underline cursor-pointer text-input-variant" href="/profile">
                            здесь
                        </Link>
                    </div>
                )
            }
        </div>
    )
}