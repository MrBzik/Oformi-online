"use client"

import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useTRPC} from "@/trpc/client";
import {useMutation, useQuery, useSuspenseQuery} from "@tanstack/react-query";
import {useSheet} from "@/lib/sheetContext";
import {useChatContext} from "stream-chat-react";
import {useCreateNewChat} from "@/hooks/useCreateNewChat";
import {MessageCircleMore} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {startChatUnauthorizedSchema} from "@/modules/stream/schemas";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import Link from "next/link";
import {createToken} from "@/actions/createToken";
import streamClient from "@/lib/stream";

interface Props {
    tenantSlug: string;
}

export const ProductChatButton = ({
    tenantSlug,
} : Props) => {

    const trpc = useTRPC()
    const {data: session} = useSuspenseQuery(trpc.auth.session.queryOptions())
    const {data: tenantUser} = useSuspenseQuery(trpc.tenants.getUser.queryOptions(
        {slug: tenantSlug}
    ))

    const createNewChat = useCreateNewChat()

    const { setActiveChannel } = useChatContext()

    const {client} = useChatContext();

    const {openSheet} = useSheet()

    const router = useRouter()

    const { setMobileInChannel, setChatUserId } = useSheet()

    const [openDialog, setOpenDialog] = useState(false)

    const { setConnected } = useSheet()

    const [isFromMobile, setFromMobile] = useState(false)

    const form = useForm<z.infer<typeof startChatUnauthorizedSchema>>({
        mode: "all",
        resolver: zodResolver(startChatUnauthorizedSchema),
        defaultValues: {
            username: ""
        },
    })

    const registerChatUser = useMutation(trpc.stream.registerChatUser.mutationOptions())

    const onCreateChatUser = async (values: z.infer<typeof startChatUnauthorizedSchema>) => {
        setOpenDialog(false)
        const id = crypto.randomUUID()

        registerChatUser.mutate({
            username: values.username,
            userId: id
        })

        const tokenProvider = async () => {
            return await createToken(id);
        }

        try {
            await streamClient.connectUser({
                    id: id,
                    name: values.username,
                },
                tokenProvider)
            setChatUserId(id)
            setConnected(true)
            await onStartChat(isFromMobile)
        } catch (err) {
            console.error(err);
        }
    }


    const onStartChat = async (isMobile: boolean) => {

        if((session.user || client.user?.online) && tenantUser){
            let isAnError = false
            const channel = await createNewChat({
                members: [session.user?.id || client.user?.id || "", tenantUser.id],
                createdBy: session.user?.id || client.user?.id || "",
            })

            if(channel){
                setActiveChannel(channel)
            }

            else {
                isAnError = true
            }
            if(!isAnError){
                if(isMobile) {
                    setMobileInChannel(true)
                    router.push("/chat")
                } else {
                    openSheet()
                }
            }
        } else {
            setFromMobile(isMobile)
            setOpenDialog(true)
        }
    }

    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <MessageCircleMore
                        className="hidden lg:block w-12 h-12 text-input-variant hover:text-indigo-500 cursor-pointer"
                        onClick={() => onStartChat(false)}
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Чат с исполнителем</p>
                </TooltipContent>
            </Tooltip>
            <Button
                className={cn("block lg:hidden w-full rounded-lg border-input-variant border-4")}
                onClick={() => onStartChat(true)}
            >
                Чат с продавцом
            </Button>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onCreateChatUser)} className="space-y-4">
                            <DialogHeader>
                                <DialogTitle>Чат с исполнителем</DialogTitle>
                                <DialogDescription>
                                    Укажите ваше имя
                                </DialogDescription>
                            </DialogHeader>

                            {/* Name */}
                            <FormField name="username" render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Имя*
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            ) }/>

                            <p className="text-sm">
                                <Link href={"/sign-in"} className="text-input-variant underline cursor-pointer">Авторизуйтесь</Link>{" "}
                                чтобы общаться с разных устройств
                            </p>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="elevated" onClick={() => {setOpenDialog(false)}}>Назад</Button>
                                </DialogClose>
                                <Button type="submit">Готово</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )

}