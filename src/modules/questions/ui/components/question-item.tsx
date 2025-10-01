import {StarRating} from "@/components/star-rating";
import {Question, Review, User} from "@/payload-types";
import {Card} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {reviewResponseSchema} from "@/modules/reviews/schemas";
import {useTRPC} from "@/trpc/client";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {questionResponseSchema} from "@/modules/questions/schemas";

interface Props {
    question: Question & { user: User };
    canResponse: boolean;
}

const formatter = new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
});

export const QuestionItem = ({
    question,
    canResponse,
} : Props) => {

    const trpc = useTRPC();
    const queryClient = useQueryClient()

    const upsertResponse = useMutation(trpc.questions.submitResponse.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [trpc.questions.getMany.queryKey().entries()]
            });
            toast.success("Ваш ответ успешно опубликован")
        }
    }))

    const form = useForm<z.infer<typeof questionResponseSchema>>({
        resolver: zodResolver(questionResponseSchema),
        defaultValues: {
            response: question.response || ""
        }
    })

    const onSubmit = (data: z.infer<typeof questionResponseSchema>) => {
        upsertResponse.mutate({
            reviewId: question.id,
            response: data.response
        })
    };

    return (
        <Card
            className="p-6 flex flex-col gap-3 w-full">
            <span className="text-sm text-muted-foreground w-full text-right">{formatter.format(new Date(question.createdAt))}</span>
            <p className="font-semibold">{question.user.username}</p>
            <p className="font-medium italic">{question.question}</p>
            {
                question.response && (
                    <div className="py-4 border-t border-muted-foreground text-end border-dashed">
                        <span className="italic">{question.response}</span>
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
                                                <Textarea {...field} placeholder="Ответить на вопрос"/>
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
                                        Опубликовать
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