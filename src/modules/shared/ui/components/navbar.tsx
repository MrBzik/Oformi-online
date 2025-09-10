"use client"

import {SignInButton} from "@/modules/auth/ui/components/sign-in-button";
import {MainHeader} from "@/modules/shared/ui/components/main-header";
import {TenantLink} from "@/modules/tenants/ui/components/TenantLink";

interface Props {
    tenantSlug?: string;
}

export const Navbar = ({
    tenantSlug
} : Props) => {

    return (
        <nav className="py-6 font-medium bg-bg-secondary">
            <div className="max-w-(--breakpoint-2xl) mx-auto flex justify-between items-start h-full px-4 lg:px-12">
                <div className="flex flex-row gap-x-4 items-start">
                    <MainHeader/>
                    {
                        tenantSlug && (
                            <TenantLink tenantSlug={tenantSlug} />
                        )
                    }
                </div>
                <SignInButton/>
            </div>
        </nav>
    )
}

export const NavbarLoading = () => {
    return (
        <nav className="h-20 font-medium bg-bg-secondary">
            <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
                <div/>
            </div>
        </nav>
    )
}