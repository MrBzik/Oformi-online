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
import { Label } from "@/components/ui/label"
import {useForm} from "react-hook-form";
import {z} from "zod";
import {orderProductSchema} from "@/modules/auth/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {useTRPC} from "@/trpc/client";
import {useMutation, useSuspenseQuery} from "@tanstack/react-query";
import {cn} from "@/lib/utils";

interface Props {
    productId: string;
    productName: string;
}

export const ProductOrder = ({productId, productName} : Props) => {
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
            username: session.data?.user?.username,
            email: session.data?.user?.email,
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
            productName: productName,
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

            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Оставить заявку на услугу</DialogTitle>
                        <DialogDescription>
                            Оставьте свои контактные данные
                        </DialogDescription>
                    </DialogHeader>

                    {/* Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">Имя</Label>
                        <Input
                            id="username"
                            type="name"
                            {...form.register("username")}
                        />
                        {form.formState.errors.username && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.username.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Электронная почта</Label>
                        <Input
                            id="email"
                            type="email"
                            {...form.register("email")}
                        />
                        {form.formState.errors.email && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Phone */}
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Номер телефона</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+123456789"
                            {...form.register("phone")}
                        />
                        {form.formState.errors.phone && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.phone.message}
                            </p>
                        )}
                    </div>

                    {/* Telegram */}
                    <div className="grid gap-2">
                        <Label htmlFor="telegram">Telegram</Label>
                        <Input
                            id="telegram"
                            placeholder="@username"
                            {...form.register("telegram")}
                        />
                        {form.formState.errors.telegram && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.telegram.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" onClick={() => {setOpen(false)}}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )

}