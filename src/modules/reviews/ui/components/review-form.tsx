import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {StarPicker} from "@/modules/reviews/ui/components/star-picker";
import {useTRPC} from "@/trpc/client";
import {useMutation, useQuery, useSuspenseQuery} from "@tanstack/react-query";
import {toast} from "sonner";

interface Props {
    productId: string;
}

const formSchema = z.object({
    rating: z.number().min(1, {message: "Необходимо указать рейтинг"}).max(5),
    description: z.string().min(1, {message: "Необходимо описание"})
})

export const ReviewForm = ({
    productId,
} : Props) => {

    const trpc = useTRPC();
    const {data: session} = useQuery(trpc.auth.session.queryOptions())

    const {data: initialData} = useSuspenseQuery(trpc.reviews.getOne.queryOptions({
        productId: productId,
    }))

    const upsertReview = useMutation(trpc.reviews.upsert.mutationOptions({
        onSuccess: () => {
            toast.success("Отзыв успешно опубликован")
        }
    }))

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rating: initialData?.rating ?? 0,
            description: initialData?.description ?? ""
        }
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        upsertReview.mutate({
            productId: productId,
            rating: data.rating,
            description: data.description
        })
    };

    return (
        <Form {...form}>
            <form
                className="flex flex-col gap-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <p className="font-medium">Ваш отзыв об услуге</p>
                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <StarPicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={session?.user == null}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button
                    disabled={session?.user == null}
                    type={"submit"}
                    size="lg"
                    className="bg-black text-white hover:bg-blue-400 hover:text-primary w-fit"
                >
                    {session?.user ? "Опубликовать" : "Требуется авторизация"}
                </Button>
            </form>
        </Form>
    )
}