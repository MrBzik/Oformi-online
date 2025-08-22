import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {useForm} from "react-hook-form";
import {z} from "zod";
import {orderProductSchema} from "@/modules/auth/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {useTRPC} from "@/trpc/client";
import {useMutation, useSuspenseQuery} from "@tanstack/react-query";
import {cn} from "@/lib/utils";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";

interface Props {
    productId: string;
}

export const ProductOrder = ({productId} : Props) => {
    const trpc = useTRPC()
    const {data : ordered} = useSuspenseQuery(trpc.orders.getOne.queryOptions({
        productId: productId,
    }))

    const session = useSuspenseQuery(trpc.auth.session.queryOptions())

    const [isOrdered, setOrdered] = useState(ordered);

    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof orderProductSchema>>({
        mode: "all",
        resolver: zodResolver(orderProductSchema),
        defaultValues: {
            username: session.data?.user?.username ?? "",
            email: session.data?.user?.email ?? "",
            phone: "",
            telegram: "",
        },
    })

    const createOrder = useMutation(trpc.orders.create.mutationOptions({
        onSuccess: () => {
            setOrdered(true)
        }
    }))


    const onSubmit = (values: z.infer<typeof orderProductSchema>) => {
        setOpen(false)
        createOrder.mutate({
            productId: productId,
            ...values
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className={cn("flex-1", isOrdered ? "bg-green-400" : "bg-blue-400")}
                        disabled={isOrdered}
                        onClick={() => {
                            {setOpen(true)}
                        }

                        }>
                    {isOrdered ? ("Заявка принята") : ("Оставить заявку")}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>Оставить заявку на услугу</DialogTitle>
                            <DialogDescription>
                                Укажите свои контактные данные
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

                        {/* Email */}
                        <FormField name="email" render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Электронная почта*
                                </FormLabel>
                                <FormControl>
                                    <Input {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        ) }/>

                        {/* Phone */}
                        <FormField name="phone" render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Номер телефона
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="+123456789" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        ) }/>

                        {/* Telegram */}
                        <FormField name="telegram" render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Telegram
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="@username" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        ) }/>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="elevated" onClick={() => {setOpen(false)}}>Назад</Button>
                            </DialogClose>
                            <Button type="submit">Отправить</Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )

}