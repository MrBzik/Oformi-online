"use client"

import {toast} from "sonner";
import Link from "next/link";

interface Props {
    userId?: string,
    refPercentage: number
}

export const ReferralHeader = ({
    userId,
    refPercentage,
} : Props) => {
    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex gap-x-1">
                <span>Приглашай новых покупателей по</span>
                <span
                    className="underline text-input-primary cursor-pointer"
                    onClick={() => {
                        navigator.clipboard.writeText(`https:/oformi.online/?ref=${userId}`)
                        toast.success("Реферальная ссылка скопирована")
                    }}
                >реферальной ссылке!</span>
                <span>Зарабатывай {refPercentage}% с каждой продажи!</span>
            </div>
            <div className="flex gap-x-1">
                <span>Не забудь подключить Telegram уведомления</span>
                <Link className="underline cursor-pointer text-input-variant" href="/profile">
                    здесь
                </Link>
            </div>
        </div>
    )
}