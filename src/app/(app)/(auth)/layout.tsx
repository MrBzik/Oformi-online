
interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto">
                {children}
            </div>
            <div className="h-screen w-full lg:col-span-2 hidden lg:block"
                 style={{
                     backgroundImage: "url('/auth-bg.png')",
                     backgroundSize: "cover",
                     backgroundPosition: "center"
                 }}
            />
        </div>
    )
}

export default Layout;