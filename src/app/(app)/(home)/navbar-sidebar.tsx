import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {ScrollArea} from "@/components/ui/scroll-area";
import Link from "next/link";


interface NavbarItem {
    href: string;
    children: React.ReactNode;
}

interface Props {
    items: NavbarItem[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const NavbarSidebar = (
    {
        items,
        open,
        onOpenChange,
    } : Props
) => {
    return (<Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left"
            className="p-0 transition-none">
            <SheetHeader className="p-4 border-b">
                <SheetTitle>
                    Menu
                </SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
                {items.map((item) => (
                    <Link href={item.href} key={item.href}
                        className="navbarItem"
                        onClick={() => onOpenChange(false)}>
                        {item.children}
                    </Link>
                ))}
                <div className="border-t">
                    <Link href="/sign-in" className="navbarItem" onClick={() => onOpenChange(false)}>
                        Войти
                    </Link>
                    <Link href="/sign-up" className="navbarItem" onClick={() => onOpenChange(false)}>
                        Начать продажи
                    </Link>
                </div>
            </ScrollArea>
        </SheetContent>
    </Sheet>)
}