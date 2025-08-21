"use client"

import {useForm} from "react-hook-form";
import {z} from "zod";
import { Poppins} from "next/font/google"
import {registerSchema} from "@/modules/auth/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {EyeIcon, EyeOffIcon, ListFilterIcon} from "lucide-react";
import {useTRPC} from "@/trpc/client";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

const poppins = Poppins({
    subsets:["latin"],
    weight: ["700"]
})

export const SingUpView = () => {

    const router = useRouter()

    const trpc = useTRPC();
    const queryClient = useQueryClient()
    const register = useMutation(trpc.auth.register.mutationOptions({
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess : async () => {
            await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
            router.push("/");
        }
    }))

    const form = useForm<z.infer<typeof registerSchema>>({
        mode:"all",
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            username: ""
        }
    });

    const onSubmit = (values: z.infer<typeof registerSchema>) => {
        register.mutate(values)
    }

    const username = form.watch("username")
    const usernameErrors = form.formState.errors.username;

    const showPreview = username && !usernameErrors;

    const [passwordType, setIsPasswordVisible] = useState("password");

    const togglePassVisibility = () => {
        if(passwordType === "password") {
            setIsPasswordVisible("text");
        } else {
            setIsPasswordVisible("password");
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-8 p-4 lg:p-16">
                        <div className="flex items-center justify-between mb-8">
                            <Link href="/">
                                <span className={cn(
                                    "text-2xl font-semibold", poppins.className
                                )}>
                                    Oformi.online
                                </span>
                            </Link>
                            <Button asChild variant="ghost" size="sm"
                            className="text-base border-none underline">
                                <Link prefetch href="/sign-in">
                                    Войти
                                </Link>
                            </Button>
                        </div>
                    <h1 className="text-4xl font-medium">
                        Успей стать участником команды Оформи Онлайн
                    </h1>
                        <FormField name="username" render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Название магазина
                                </FormLabel>
                                <FormControl>
                                    <Input {...field}/>
                                </FormControl>
                                <FormDescription className={cn("hidden", showPreview && "block")}>
                                    Ваш магазин будет доступен по ссылке&nbsp;
                                    <strong>{username}</strong>
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        ) }/>
                        <FormField name="email" render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Электронная почта
                                </FormLabel>
                                <FormControl>
                                    <Input {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        ) }/>
                        <div className="flex items-end gap-2 w-full">
                            <FormField name="password" render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>
                                        Пароль
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} type={passwordType}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            ) }/>
                            <Button
                                className="size-12 shrink-0 flex"
                                onClick={() => togglePassVisibility()}>
                                {(passwordType === "password") ? <EyeIcon/> : <EyeOffIcon/>}
                            </Button>
                        </div>
                        <Button
                            disabled={register.isPending}
                            type="submit"
                            size="lg"
                            className="bg-black text-white hover:bg-pink-400 hover:text-primary">
                            Создать аккаунт
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="h-screen w-full lg:col-span-2 hidden lg:block"
            style={{
                backgroundImage: "url('/auth-bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
            />

        </div>
    )

}


