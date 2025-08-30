"use client"

import {useForm} from "react-hook-form";
import {z} from "zod";
import {loginSchema} from "@/modules/auth/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {EyeIcon, EyeOffIcon} from "lucide-react";
import {useTRPC} from "@/trpc/client";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {AuthNavigation} from "@/modules/auth/ui/components/auth-navigation";

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

    const [passwordType, setIsPasswordVisible] = useState("password");

    const togglePassVisibility = () => {
        if(passwordType === "password") {
            setIsPasswordVisible("text");
        } else {
            setIsPasswordVisible("password");
        }
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
                    disabled={login.isPending}
                    type="submit"
                    size="lg"
                    className="bg-black text-white hover:bg-pink-400 hover:text-primary">
                    Войти
                </Button>
            </form>
        </Form>
    )

}


