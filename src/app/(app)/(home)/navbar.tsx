"use client"

import { Poppins} from "next/font/google"
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {usePathname} from "next/navigation";
import {useState} from "react";
import {MenuIcon} from "lucide-react";
import "./navbar.css"
import {NavbarSidebar} from "@/app/(app)/(home)/navbar-sidebar";
import {useTRPC} from "@/trpc/client";
import {useQuery} from "@tanstack/react-query";

const poppins = Poppins({
    subsets:["latin"],
    weight: ["700"]
})

interface NavbarItemProps {
    href: string;
    children: React.ReactNode;
    isActive?: boolean;
}

const NavbarItem = (
    { href, children, isActive }: NavbarItemProps
) => {
    return (
        <Button asChild
            variant="outline"
                className={cn(
                    "bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg",
                    isActive && "bg-black text-white hover:bg-black hover:text-white"
                )}>
            <Link href={href}>
                {children}
            </Link>
        </Button>
    )
}

const navbarItems : NavbarItemProps[] = [
    {href : "/", children: "На главную" },
    {href : "/about", children: "О нас" },
    {href : "/features", children: "Преимущества" },
    {href : "/pricing", children: "Стать партнером" },
    {href : "/contacts", children: "Контакты" },
];

export const Navbar = () => {
    const pathname = usePathname()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const trpc = useTRPC()
    const session = useQuery(trpc.auth.session.queryOptions())

    return (
        <nav className="h-20 flex justify-between font-medium ">
            <Link href="/public" className="pl-6 flex items-center">
                <h1 className={cn("text-5xl font-semibold", poppins.className)}>
                    <span className="text-sky-600">О</span>
                    <span>форми </span>
                    <span className="text-orange-500">О</span>
                    <span>нлайн</span>
                </h1>
            </Link>
            
            <NavbarSidebar items={navbarItems} open={isSidebarOpen} onOpenChange={setIsSidebarOpen}/>
            
            <div className="items-center gap-4 hidden lg:flex">
                {navbarItems.map((item) => (
                    <NavbarItem
                        href={item.href}
                        key={item.href}
                        isActive={item.href === pathname}>
                        {item.children}
                    </NavbarItem>
                    ))}
            </div>

            {session.data?.user ? (
                <div className="hidden lg:flex">
                    <Button asChild variant="link"
                            className="h-full text-lg border-0">
                        <Link href="/admin" className="underline">
                            {session.data!.user.username}
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="hidden lg:flex">
                    <Button asChild variant="link"
                            className="h-full text-lg border-0">
                        <Link prefetch href="/sign-in" className="underline">
                            Войти
                        </Link>
                    </Button>
                    <Button asChild variant="link"
                            className="h-full text-lg border-0">
                        <Link prefetch href="/sign-up" className="underline">
                            Начать продажи
                        </Link>
                    </Button>
                </div>
            )}

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