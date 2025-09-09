"use client"

import {useForm} from "react-hook-form";
import {z} from "zod";
import {resetPasswordSchema} from "@/modules/auth/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {useTRPC} from "@/trpc/client";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {AuthNavigation} from "@/modules/auth/ui/components/auth-navigation";
import {PasswordWithToggle} from "@/modules/auth/ui/components/password-with-toggle";

interface Props {
    token: string;
}

export const ResetPassword = (
    {token}: Props
) => {

    const router = useRouter()

    const trpc = useTRPC();
    const queryClient = useQueryClient()
    const register = useMutation(trpc.auth.resetPassword.mutationOptions({
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess : async () => {
            await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
            router.push("/sign-in");
        }
    }))

    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        mode:"all",
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            token: token,
            password: "",
        }
    });

    const onSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
        register.mutate(values)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-8 p-4 lg:p-16">
                <AuthNavigation label="Войти" navDestination="/sign-in"/>
                <h1 className="text-4xl font-medium">
                    Введите новый пароль
                </h1>
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
                    Подтвердить
                </Button>
            </form>
        </Form>
    )
}


