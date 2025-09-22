import {StarRating} from "@/components/star-rating";
import {Review, User} from "@/payload-types";
import {Card} from "@/components/ui/card";
import {Form, FormControl, FormDescription, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {StarPicker} from "@/modules/reviews/ui/components/star-picker";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {reviewResponseSchema, reviewSchema} from "@/modules/reviews/schemas";
import {useTRPC} from "@/trpc/client";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

interface Props {
    review: Review & { user: User };
    canResponse: boolean;
}

const formatter = new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
});

export const ReviewItem = ({
    review,
    canResponse,
} : Props) => {

    const trpc = useTRPC();
    const queryClient = useQueryClient()

    const upsertResponse = useMutation(trpc.reviews.submitResponse.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [trpc.reviews.getMany.queryKey().entries()]
            });
            toast.success("Ваш ответ успешно опубликован")
        }
    }))

    const form = useForm<z.infer<typeof reviewResponseSchema>>({
        resolver: zodResolver(reviewResponseSchema),
        defaultValues: {
            response: review.response || ""
        }
    })

    const onSubmit = (data: z.infer<typeof reviewResponseSchema>) => {
        upsertResponse.mutate({
            reviewId: review.id,
            response: data.response
        })
    };

    return (
        <Card
            className="p-6 flex flex-col gap-3 w-full]">
            <span className="text-sm text-muted-foreground w-full text-right">{formatter.format(new Date(review.createdAt))}</span>
            <div className="flex flex-row justify-between">
                <p className="font-semibold">{review.user.username}</p>
                <StarRating
                    rating={review.rating}
                    iconClassName="size-3"
                />
            </div>
            <p className="font-medium italic">{review.description}</p>
            {
                review.response && (
                    <div className="py-4 border-t border-muted-foreground text-end border-dashed">
                        <span className="italic">{review.response}</span>
                    </div>
                )
            }
            {
                canResponse && (
                    <div className="mt-2 border-t border-dashed pt-6">
                        <Form {...form}>
                            <form
                                className="flex flex-col gap-y-4"
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <FormField
                                    control={form.control}
                                    name="response"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea {...field} placeholder="Оставить ответ на отзыв"/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-end">
                                    <Button
                                        disabled={upsertResponse.isPending}
                                        type="submit"
                                        size="lg"
                                        className="bg-black text-white hover:bg-blue-400 hover:text-primary"
                                    >
                                        Ответить
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                )
            }
        </Card>
    )
}