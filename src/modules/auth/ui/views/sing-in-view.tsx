"use client"

import {useForm} from "react-hook-form";
import {z} from "zod";
import {loginSchema} from "@/modules/auth/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useTRPC} from "@/trpc/client";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {AuthNavigation} from "@/modules/auth/ui/components/auth-navigation";
import Link from "next/link";
import {PasswordWithToggle} from "@/modules/auth/ui/components/password-with-toggle";
import {ServicesSingInButton} from "@/modules/auth/ui/components/services-sing-in-button";

export const SignInView = () => {

    const router = useRouter()

    const trpc = useTRPC();
    const queryClient = useQueryClient()
    const login = useMutation(trpc.auth.login.mutationOptions({
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess : async () => {
            await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
            router.push("/");
        }
    }))

    const form = useForm<z.infer<typeof loginSchema>>({
        mode:"all",
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        login.mutate(values)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-8 p-4 lg:p-16">
                <AuthNavigation label="Зарегистрироваться" navDestination="/sign-up"/>
                <h1 className="text-4xl font-medium">
                    Войти в существующий аккаунт
                </h1>
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
                    disabled={login.isPending}
                    type="submit"
                    size="lg"
                    className="bg-black text-white hover:bg-pink-400 hover:text-primary">
                    Войти
                </Button>
                <Link prefetch href="/sign-up" className="text-base border-none underline flex lg:hidden text-input-primary">
                    Зарегистрироваться
                </Link>
                <Link href="/forgot-password" className="text-input-variant">
                    Забыли пароль?
                </Link>
                <ServicesSingInButton/>
            </form>
        </Form>
    )

}


