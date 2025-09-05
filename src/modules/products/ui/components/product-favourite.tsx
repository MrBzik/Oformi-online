import { Button } from "@/components/ui/button"
import {useState} from "react";
import {useTRPC} from "@/trpc/client";
import {useMutation, useSuspenseQuery} from "@tanstack/react-query";
import {cn} from "@/lib/utils";
import {toast} from "sonner";

interface Props {
    productId: string;
    isArchived: boolean
}

export const ProductAddToFavourite = ({
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

    let buttonText = "В избранное";
    if (!session?.user) {
        buttonText = "Требуется авторизация";
    } else if (isArchived) {
        buttonText = "Услуга архивирована";
    } else if (isFavoured) {
        buttonText = "Убрать";
    }

    return (
        <>
            <p className="font-medium">
                {isFavoured ? "Убрать из избранного" : "Добавить в избранное"}
            </p>
            <Button
                className={cn("flex-1 bg-red-400")}
                onClick={() => {
                    if(isFavoured){
                        removeFromFavourite.mutate({
                            productId: productId,
                        });
                    } else {
                        addToFavourite.mutate({
                            productId: productId,
                        });
                    }
                }}
                disabled={!session?.user || isArchived}
            >
                {buttonText}
            </Button>
        </>
    )
}