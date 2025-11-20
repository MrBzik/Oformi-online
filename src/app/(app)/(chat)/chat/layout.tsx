import type {Metadata} from "next";


interface Props {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: "Общайся на Оформи.онлайн",
    description: "Все услуги в одном месте. Просто. Удобно. Онлайн",
};

const Layout = async ({ children }: Props) => {

    return (
        <div className="bg-white">
            {children}
        </div>
    )
}

export default Layout
