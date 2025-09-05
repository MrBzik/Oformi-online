"use client"

import {Button} from "@/components/ui/button";
import {useState} from "react";
import {MenuIcon} from "lucide-react";
import "./navbar.css"
import {NavbarSidebar} from "@/app/(app)/(home)/navbar-sidebar";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {SearchInput} from "@/app/(app)/(home)/search-filters/search-input";
import {useProductFilters} from "@/modules/products/hooks/use-product-filters";
import {MainHeader} from "@/modules/shared/ui/components/main-header";
import {SignInButton} from "@/modules/auth/ui/components/sign-in-button";



interface NavbarItemProps {
    href: string;
    children: React.ReactNode;
    isActive?: boolean;
}


const navbarItems : NavbarItemProps[] = [
    {href : "/", children: "На главную" },
    {href : "/about", children: "О нас" },
    {href : "/features", children: "Преимущества" },
    {href : "/pricing", children: "Стать партнером" },
    {href : "/contacts", children: "Контакты" },
];

export const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const trpc = useTRPC()
    const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
    const [filters, setFilters] = useProductFilters();

    return (
        <nav className="h-30 flex font-medium gap-x-4">
            <MainHeader/>
            <NavbarSidebar items={navbarItems} open={isSidebarOpen} onOpenChange={setIsSidebarOpen}/>

            <SearchInput
                categories={data}
                defaultValue={filters.search}
                onSearchChange={(searchInput) => setFilters({
                    search: searchInput,
                })}
                onCategoryChange={(categorySlug) => setFilters({
                    category: categorySlug,
                })}
            />

            <SignInButton/>

            <div className="flex lg:hidden items-center justify-center">
                <Button variant="ghost"
                        className="size-12 border-transparent bg-white"
                        onClick={() => setIsSidebarOpen(true)}>
                    <MenuIcon/>
                </Button>
            </div>
        </nav>
    )
}