import {Footer} from "@/modules/shared/ui/components/footer";
import {Navbar} from "@/modules/shared/ui/components/navbar";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = async ({children} : LayoutProps) => {

    return (
        <div className="min-h-screen flex flex-col bg-bg-primary">
            <div className="max-w-(--breakpoint-2xl) mx-auto flex flex-col min-h-screen w-full">
                <Navbar/>
                <div className="flex-1">
                    {children}
                </div>
                <Footer/>
            </div>
        </div>
    )
}

export default Layout