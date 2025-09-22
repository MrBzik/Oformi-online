"use client"

import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {tgNotificationsConnectSchema} from "@/modules/auth/schemas";
import {useTRPC} from "@/trpc/client";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import Link from "next/link";
import Image from "next/image";

export const TgNotificationsSetup = () => {

    const trpc = useTRPC();
    const connectChatId = useMutation(trpc.auth.tgNotificationsConnect.mutationOptions({
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess : async () => {
            toast.success("Ключ успешно добавлен")
        }
    }))

    const form = useForm<z.infer<typeof tgNotificationsConnectSchema>>({
        mode:"all",
        resolver: zodResolver(tgNotificationsConnectSchema),
        defaultValues: {
            chatId: ""
        }
    });

    const onSubmit = (values: z.infer<typeof tgNotificationsConnectSchema>) => {
        connectChatId.mutate(values)
    }

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg">Telegram уведомления</h2>
            <div className="flex flex-col gap-y-2 pl-6 text-muted-foreground">
                <span className="">Получайте уведомления о продажах и реферальной программе через Telegram бота</span>
                <div className="flex gap-x-1">
                    <span>Перейдите в бота</span>
                    <Link href="https://t.me/messageOobot" className="font-bold undeline text-input-variant">Новая заявка - Оформи.онлайн</Link>
                </div>
                <span>
                            Далее нажмите кнопку START и скопируйте полученный ключ
                        </span>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-8">
                    <FormField name="chatId" render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Ключ, полученный из Telegram бота*
                            </FormLabel>
                            <FormControl>
                                <Input {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    ) }/>
                    <Button
                        disabled={connectChatId.isPending}
                        type="submit"
                        size="lg"
                        className="bg-black text-white hover:bg-pink-400 hover:text-primary">
                        Подключить Telegram уведомления
                    </Button>
                </form>
            </Form>
        </div>
    )

}