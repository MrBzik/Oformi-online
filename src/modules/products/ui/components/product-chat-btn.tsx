import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useSheet} from "@/lib/sheetContext";
import {useChatContext} from "stream-chat-react";
import {useCreateNewChat} from "@/hooks/useCreateNewChat";
import {InfoIcon, MessageCircleMore} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

interface Props {
    tenantSlug: string;
}

export const ProductChatButton = ({
    tenantSlug,
} : Props) => {

    const trpc = useTRPC()
    const {data: session} = useSuspenseQuery(trpc.auth.session.queryOptions())
    const {data: tenantUser} = useSuspenseQuery(trpc.tenants.getUser.queryOptions(
        {slug: tenantSlug}
    ))

    const createNewChat = useCreateNewChat()

    const { setActiveChannel } = useChatContext()

    const {openSheet} = useSheet()

    const router = useRouter()

    const { setMobileInChannel } = useSheet()

    const onStartChat = async (isMobile: boolean) => {
        let isAnError = false

        if(session.user && tenantUser){
            const channel = await createNewChat({
                members: [session.user.id, tenantUser.id],
                createdBy: session.user.id,
            })

            if(channel){
                setActiveChannel(channel)
            }

            else {
                isAnError = true
            }
        }

        if(!isAnError){
            if(isMobile) {
                setMobileInChannel(true)
                router.push("/chat")
            } else {
                openSheet()
            }
        }
    }

    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <MessageCircleMore
                        className="hidden lg:block w-12 h-12 text-input-variant hover:text-indigo-500 cursor-pointer"
                        onClick={() => onStartChat(false)}
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Чат с исполнителем</p>
                </TooltipContent>
            </Tooltip>
            <Button
                className={cn("block lg:hidden w-full rounded-lg border-input-variant border-4")}
                onClick={() => onStartChat(true)}
            >
                Чат с продавцом
            </Button>
        </>
    )

}