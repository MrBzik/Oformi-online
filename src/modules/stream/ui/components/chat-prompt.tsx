import {MessageCircleMore} from "lucide-react";
import {ReactNode} from "react";
import Link from "next/link";

interface Props {
    title: ReactNode;
    description: string;
}

export const ChatPrompt= ({title, description} : Props) => {
    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center justify-center h-full py-12 px-4">
            <MessageCircleMore
                className="w-15 h-15 opacity-20 mb-4"
            />
            <h2 className="text-xl font-medium text-foreground text-center mb-2">
                {title}
            </h2>
            <p className="text-sm text-muted-foreground text-center leading-relaxed max-w-[200px]">
                {description}
            </p>
        </div>
    )
}

export const ChatPromptReload = () => {
    return (
        <ChatPrompt title={
            <p>
                <span
                    onClick={() => {
                        window.location.reload()
                    }}
                    className="text-input-variant underline cursor-pointer">
                    Перезагрузите
                </span>{" "}
                страницу
            </p>
        } description="Чат был отключен из-за долгого бездействия"/>
    )
}

export const ChatPromptSignIn = () => {
    return (
        <ChatPrompt
            title={
                <p>
                    <Link href={"/sign-in"} className="text-input-primary underline cursor-pointer">Авторизуйтесь</Link>{" "}
                    чтобы общаться с исполнителями
                </p>
            }
            description="Здесь будут отображаться ваши чаты"/>
    )
}