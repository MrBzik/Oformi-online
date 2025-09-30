"use client"

import {useForm} from "react-hook-form";
import {z} from "zod";
import {registerSchema} from "@/modules/auth/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useTRPC} from "@/trpc/client";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {AuthNavigation} from "@/modules/auth/ui/components/auth-navigation";
import {PasswordWithToggle} from "@/modules/auth/ui/components/password-with-toggle";
import Link from "next/link";
import {useEffect} from "react";

interface Props {
    refLink?: string
}

export const SingUpView = ({refLink} : Props) => {

    const router = useRouter()

    const trpc = useTRPC();
    const queryClient = useQueryClient()

    const handleRefLink = useMutation(trpc.referral.addReferralSellerCookie.mutationOptions({}))
    useEffect(() => {
        handleRefLink.mutate({refLink: refLink})
    }, []);

    const register = useMutation(trpc.auth.register.mutationOptions({
        onError: (error) => {
            if(error.data?.code === "INTERNAL_SERVER_ERROR"){
                router.push("/verify-sent");
            }
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

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-8 p-4 lg:p-16">
                <AuthNavigation label="Войти" navDestination="/sign-in"/>
                <h1 className="text-4xl font-medium">
                    Успей стать участником команды Оформи Онлайн
                </h1>
                <FormField name="username" render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Имя пользователя
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
                                <PasswordWithToggle field={field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    ) }/>
                </div>
                <Button
                    disabled={register.isPending}
                    type="submit"
                    size="lg"
                    className="bg-black text-white hover:bg-pink-400 hover:text-primary">
                    Создать аккаунт
                </Button>
                <Link prefetch href="/sign-in" className="text-base border-none underline flex lg:hidden text-input-primary mb-20">
                    Войти
                </Link>
            </form>
        </Form>
    )

}


