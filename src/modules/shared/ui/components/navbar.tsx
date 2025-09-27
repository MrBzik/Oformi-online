"use client"

import {SignInButton} from "@/modules/auth/ui/components/sign-in-button";
import {MainHeader} from "@/modules/shared/ui/components/main-header";

interface Props {
    children?: React.ReactNode;
}

export const Navbar = ({
    children
} : Props) => {

    return (
        <nav className="py-6 font-medium bg-bg-secondary border-0 border-b-[2px] lg:border-l-[2px] lg:border-r-[2px] lg:rounded-bl-4xl lg:rounded-br-4xl">
            <div className="max-w-(--breakpoint-2xl) mx-auto flex justify-between items-start h-full px-4 lg:px-12">
                <div className="flex flex-row gap-x-4 items-center">
                    <MainHeader/>
                    {
                       children
                    }
                </div>
                <SignInButton/>
            </div>
        </nav>
    )
}

export const NavbarLoading = () => {
    return (
        <nav className="h-20 font-medium bg-bg-secondary border-0 border-b-[2px] lg:border-l-[2px] lg:border-r-[2px] lg:rounded-bl-4xl lg:rounded-br-4xl">
            <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
                <div/>
            </div>
        </nav>
    )
}