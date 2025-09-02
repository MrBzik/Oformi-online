"use client"

import { Poppins} from "next/font/google"
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {MenuIcon} from "lucide-react";
import "./navbar.css"
import {NavbarSidebar} from "@/app/(app)/(home)/navbar-sidebar";
import {useTRPC} from "@/trpc/client";
import {useQuery, useSuspenseQuery} from "@tanstack/react-query";
import {SearchInput} from "@/app/(app)/(home)/search-filters/search-input";
import {useProductFilters} from "@/modules/products/hooks/use-product-filters";

const poppins = Poppins({
    subsets:["latin"],
    weight: ["700"]
})

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
    const session = useQuery(trpc.auth.session.queryOptions())
    const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
    const [filters, setFilters] = useProductFilters();

    return (
        <nav className="h-30 flex font-medium gap-x-4">
            <Link href="/public" className="pl-6 flex items-center shrink-0">
                <h1 className={cn("text-xl font-semibold", poppins.className)}>
                    <span className="text-sky-600">О</span>
                    <span>форми </span>
                    <span className="text-orange-500">О</span>
                    <span>нлайн</span>
                </h1>
            </Link>

            <NavbarSidebar items={navbarItems} open={isSidebarOpen} onOpenChange={setIsSidebarOpen}/>

            <SearchInput
                categories={data}
                defaultValue={filters.search}
                onChange={(value) => setFilters({
                    search: value,
                })}
            />

            <div className="hidden lg:flex">
                <Button asChild variant="link"
                        className="h-full text-lg border-0">
                    {
                        session.data?.user ? (
                            <Link href="/admin" className="underline">
                                {session.data!.user.username}
                            </Link>
                        ) : (
                            <Link prefetch href="/sign-in" className="underline">
                                Войти
                            </Link>
                        )
                    }
                </Button>
            </div>
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