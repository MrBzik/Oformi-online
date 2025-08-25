import {InboxIcon} from "lucide-react";

interface Props {
    children: React.ReactNode;
}


export const NoProductView = ({
    children,
} : Props ) => {
    return (
        <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
            <InboxIcon/>
            <p className="text-base font-medium">{children}</p>
        </div>
    )
}