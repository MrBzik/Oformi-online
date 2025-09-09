"use client"

import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useTRPC} from "@/trpc/client";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {tenantCreateSchema} from "@/modules/tenants/schemas";
import {Textarea} from "@/components/ui/textarea";

export const TenantRegistration = () => {

    const router = useRouter()

    const trpc = useTRPC();
    const queryClient = useQueryClient()
    const register = useMutation(trpc.tenants.create.mutationOptions({
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess : async () => {
            await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
            router.push("/profile");
        }
    }))

    const form = useForm<z.infer<typeof tenantCreateSchema>>({
        mode:"all",
        resolver: zodResolver(tenantCreateSchema),
        defaultValues: {
            tenantName: "",
            tenantSlug: "",
            description: ""
        }
    });

    const onSubmit = (values: z.infer<typeof tenantCreateSchema>) => {
        register.mutate(values)
    }

    const tenantSlug = form.watch("tenantSlug")
    const usernameErrors = form.formState.errors.tenantSlug;

    const showPreview = tenantSlug && !usernameErrors;

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-8">
                <h2 className="text-lg font-medium">
                    Стать участником коллектива Оформи Онлайн
                </h2>
                <FormField name="tenantName" render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Название магазина*
                        </FormLabel>
                        <FormControl>
                            <Input {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                ) }/>
                <FormField name="tenantSlug" render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Ссылка магазина*
                        </FormLabel>
                        <FormControl>
                            <Input {...field}/>
                        </FormControl>
                        <FormDescription className={cn("hidden", showPreview && "block")}>
                            Ваш магазин будет доступен по ссылке&nbsp;
                            <strong>{tenantSlug}</strong>
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                ) }/>
                <FormField name="description" render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Описание магазина (до 320 символов)
                        </FormLabel>
                        <FormControl>
                            <Textarea {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                ) }/>
                <Button
                    disabled={register.isPending}
                    type="submit"
                    size="lg"
                    className="bg-black text-white hover:bg-pink-400 hover:text-primary">
                    Зарегистрировать свой магазин
                </Button>
            </form>
        </Form>
    )

}


