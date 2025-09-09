interface Props {
    children: React.ReactNode;
}

export const MainContainer = ({ children }: Props) => {
    return (
        <div className="flex-1 mx-2 sm:mx-4 md:mx-6 lg:mx-8 md:border-[2px_4px_4px_2px] rounded-xl overflow-hidden md:bg-bg-primary">
            {children}
        </div>
    )
}
