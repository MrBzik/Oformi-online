import {MessageCircleMore} from "lucide-react";

interface Props {
    title: string;
    description: string;
}

export const ChatPrompt= ({title, description} : Props) => {
    return (
        <div className="flex flex-col items-center justify-center h-full py-12 px-4">
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