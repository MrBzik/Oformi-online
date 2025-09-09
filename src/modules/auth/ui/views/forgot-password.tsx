"use client"

import {useForm} from "react-hook-form";
import {z} from "zod";
import {forgotPasswordSchema} from "@/modules/auth/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useTRPC} from "@/trpc/client";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {AuthNavigation} from "@/modules/auth/ui/components/auth-navigation";
import {toast} from "sonner";

export const ForgotPassword = () => {

    const router = useRouter()

    const trpc = useTRPC();

    const restorePassword = useMutation(trpc.auth.forgotPassword.mutationOptions({
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess : async () => {
            router.push("/verify-sent");
        }
    }))

    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        mode:"all",
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        }
    });

    const OnSubmit = (values: z.infer<typeof forgotPasswordSchema>) => {
        restorePassword.mutate(values)
    }


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(OnSubmit)}
                className="flex flex-col gap-8 p-4 lg:p-16">
                <AuthNavigation label="Войти" navDestination="/sign-in"/>
                <h1 className="text-4xl font-medium">
                    Мы отправим вам письмо с подтверждением на почту
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
                <Button
                    disabled={restorePassword.isPending}
                    type="submit"
                    size="lg"
                    className="bg-black text-white hover:bg-pink-400 hover:text-primary">
                    Восстановить пароль
                </Button>
            </form>
        </Form>
    )

}


