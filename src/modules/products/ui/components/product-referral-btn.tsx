import {useState} from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {InfoIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {toast} from "sonner";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";

export const ProductReferralBtn = () => {

    const trpc = useTRPC()
    const {data: session} = useSuspenseQuery(trpc.auth.session.queryOptions())

    const [isCopied, setIsCopied] = useState(false);

    return (
        <>
            <div className="flex gap-1 items-center">
                <span className="font-medium">
                    Программа лояльности
                </span>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <InfoIcon
                            className="size-4 hover:stroke-input-variant"
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Делись реферальной ссылкой</p>
                        <p>Зарабатывай 5% с каждой продажи</p>
                    </TooltipContent>
                </Tooltip>
            </div>
            <Button
                className={cn("w-60 rounded-lg border-yellow-500 border-4")}
                onClick={async () => {
                    setIsCopied(true)
                    navigator.clipboard.writeText(window.location.href + `/?ref=${session?.user?.id}`)
                    toast.success("Реферальная ссылка скопирована. Больше информации в личном кабинете")
                    setTimeout(() => {
                        setIsCopied(false)
                    }, 1000)
                }}
                disabled={isCopied || session?.user == null}
            >
                {session?.user ? "Реферальная ссылка" : "Требуется авторизация"}
            </Button>
        </>
    )
}