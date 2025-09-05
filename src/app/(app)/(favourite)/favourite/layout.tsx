import {Footer} from "@/modules/shared/ui/components/footer";
import {Suspense} from "react";
import {Navbar, NavbarLoading} from "@/modules/shared/ui/components/navbar";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = async ({children} : LayoutProps) => {

    return (
        <div className="min-h-screen flex flex-col bg-bg-secondary ">
            <Suspense fallback={<NavbarLoading/>}>
                <Navbar/>
            </Suspense>
            <div className="flex-1 border-[2px] border-e-[4px] border-b-[4px] rounded-xl mx-12 bg-bg-primary">
                <div className="max-w-(--breakpoint-xl) mx-auto">
                    {children}
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Layout