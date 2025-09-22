import {Footer} from "@/modules/shared/ui/components/footer";
import { MainContainer } from "@/modules/shared/ui/components/main-container";
import {Navbar} from "@/modules/shared/ui/components/navbar";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = async ({children} : LayoutProps) => {

    return (
        <div className="min-h-screen flex flex-col bg-bg-secondary">
            <div className="max-w-(--breakpoint-2xl) mx-auto flex flex-col min-h-screen w-full">
                <Navbar>
                    <h1>
                        Реферальная программа
                    </h1>
                </Navbar>
                <MainContainer>
                    {children}
                </MainContainer>
                <Footer/>
            </div>
        </div>
    )
}

export default Layout