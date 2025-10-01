import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useTRPC} from "@/trpc/client";
import {useMutation, useQueryClient, useSuspenseQuery} from "@tanstack/react-query";
import {toast} from "sonner";
import {questionSchema} from "@/modules/questions/schemas";
import {waitMinutesToText} from "@/modules/utils/questionsUtils";

interface Props {
    productId: string;
}

export const QuestionForm = ({
    productId,
} : Props) => {

    const trpc = useTRPC();
    const queryClient = useQueryClient()
    const {data: session} = useSuspenseQuery(trpc.auth.session.queryOptions())

    const {data: waitTime} = useSuspenseQuery(trpc.questions.getWaitTime.queryOptions({
        productId: productId,
    }))

    const createQuestion = useMutation(trpc.questions.create.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [trpc.questions.getMany.queryKey().entries()]
            });
            toast.success("Вопрос успешно опубликован")
        }
    }))

    const form = useForm<z.infer<typeof questionSchema>>({
        resolver: zodResolver(questionSchema),
        defaultValues: {
            question: ""
        }
    })

    const onSubmit = (data: z.infer<typeof questionSchema>) => {
        createQuestion.mutate({
            productId: productId,
            question: data.question
        })
    };

    return (
        (waitTime > 0) ? (
            <p className="font-medium">Вы можете задать свой вопрос через {waitTime} {waitMinutesToText(waitTime)}</p>
        ) : (
                <Form {...form}>
                    <form
                        className="flex flex-col gap-y-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <p className="font-medium">Задайте свой вопрос</p>
                        <FormField
                            control={form.control}
                            name="question"
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
                            disabled={session?.user == null || createQuestion.isPending}
                            type={"submit"}
                            size="lg"
                            className="bg-black text-white hover:bg-blue-400 hover:text-primary w-full lg:w-fit"
                        >
                            {session?.user ? "Опубликовать" : "Требуется авторизация"}
                        </Button>
                    </form>
                </Form>
            )
    )
}