import { Button } from "@/components/ui/button"
import {useState} from "react";
import {useTRPC} from "@/trpc/client";
import {useMutation, useSuspenseQuery} from "@tanstack/react-query";
import {cn} from "@/lib/utils";
import {toast} from "sonner";
import {HeartIcon, Share2} from "lucide-react";

interface Props {
    productId: string;
    isArchived: boolean
}

export const ProductActiveButtons = ({
    productId,
    isArchived
} : Props) => {

    const trpc = useTRPC()
    const {data : alreadyFavoured} = useSuspenseQuery(trpc.favourite.getOne.queryOptions({
        productId: productId,
    }))

    const {data: session} = useSuspenseQuery(trpc.auth.session.queryOptions())

    const [isFavoured, setFavoured] = useState(alreadyFavoured);

    const addToFavourite = useMutation(trpc.favourite.create.mutationOptions({
        onSuccess: () => {
            setFavoured(true)
            toast.success("Услуга была добавлена в Избранное")
        }
    }))

    const removeFromFavourite = useMutation(trpc.favourite.remove.mutationOptions({
        onSuccess: () => {
            setFavoured(false)
            toast.success("Услуга была убрана из Избранного")
        }
    }))

    return (
        <div className="w-full flex items-center justify-end gap-4">
            <Share2
                className="size-6 hover:stroke-input-variant"
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    toast.success("Ссылка скопирована")
            }}/>
            <HeartIcon
                className={cn("size-6 hover:stroke-input-variant", isFavoured && "stroke-input-primary fill-input-primary")}
                onClick={() => {
                    if(!session.user){
                        toast.error("Требуется авторизация")
                    } else if(isArchived) {
                        toast.error("Услуга перенесена в архив")
                    } else if(isFavoured){
                        removeFromFavourite.mutate({
                            productId: productId,
                        });
                    } else {
                        addToFavourite.mutate({
                            productId: productId,
                        });
                    }
                }}
            />
        </div>
    )
}