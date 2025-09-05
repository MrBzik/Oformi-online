import {Footer} from "@/modules/shared/ui/components/footer";
import {Navbar} from "@/modules/shared/ui/components/navbar";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = async ({children} : LayoutProps) => {

    return (
        <div className="min-h-screen flex flex-col bg-bg-secondary">
            <div className="max-w-(--breakpoint-2xl) mx-auto flex flex-col min-h-screen">
                <Navbar/>
                <div className="flex-1 border-[2px] border-e-[4px] border-b-[4px] rounded-xl mx-12 bg-bg-primary">
                    <div className="max-w-(--breakpoint-2xl) mx-auto">
                        {children}
                    </div>
                </div>
                <Footer/>
            </div>
        </div>
    )
}

export default Layout