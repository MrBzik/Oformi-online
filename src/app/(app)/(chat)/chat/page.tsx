import {ChatsMobile} from "@/modules/stream/ui/views/chats-mobile";
import {ErrorBoundary} from "react-error-boundary";
import {ErrorHandler} from "@/modules/stream/ui/components/error-handler";

const Page = async () => {

    return (
        <ErrorBoundary fallback={<ErrorHandler/>}>
            <ChatsMobile/>
        </ErrorBoundary>
    )
}

export default Page