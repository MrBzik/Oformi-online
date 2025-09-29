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
import {useState} from "react";
import {ChevronDownIcon, ChevronRightIcon} from "lucide-react";

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

    const [isExpanded, setExpanded] = useState(false);

    const Icon = isExpanded ? ChevronDownIcon : ChevronRightIcon;

    const form = useForm<z.infer<typeof tenantCreateSchema>>({
        mode:"all",
        resolver: zodResolver(tenantCreateSchema),
        defaultValues: {
            tenantName: "",
            tenantSlug: "",
            description: "",
            category: ""
        }
    });

    const onSubmit = (values: z.infer<typeof tenantCreateSchema>) => {
        register.mutate(values)
    }

    const tenantSlug = form.watch("tenantSlug")
    const usernameErrors = form.formState.errors.tenantSlug;

    const showPreview = tenantSlug && !usernameErrors;

    return (
        <div className="flex flex-col gap-8">
            <h2
                onClick={() => {setExpanded(!isExpanded)}}
                className="text-lg font-medium text-input-variant cursor-pointer flex gap-1 items-center select-none">
                Зарегистрировать свой магазин
                <Icon/>
            </h2>
            {
                isExpanded && (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-8">
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
                                    <FormDescription>
                                        Описание будет отображено на странице магазина
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            ) }/>
                            <FormField name="category" render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Опишите категорию ваших услуг*
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field}/>
                                    </FormControl>
                                    <FormDescription>
                                        Данное поле используется для модерации и не отображается на странице магазина
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            ) }/>
                            <Button
                                disabled={register.isPending}
                                type="submit"
                                size="lg"
                                className="bg-black text-white hover:bg-pink-400 hover:text-primary">
                                Зарегистрировать
                            </Button>
                        </form>
                    </Form>
                )
            }
        </div>
    )

}


