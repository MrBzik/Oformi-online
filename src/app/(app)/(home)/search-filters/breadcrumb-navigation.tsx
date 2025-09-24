import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import Link from "next/link";

interface Props {
    activeCategory? : string | null;
    activeCategoryName? : string | null;
    activeSubcategoryName ? : string | null;
}

export const BreadcrumbNavigation = ({
      activeCategory,
      activeCategoryName,
      activeSubcategoryName
}: Props) => {
    if (!activeCategoryName) return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbPage className="sm:text-xs md:text-base lg:text-xl font-medium">
                        Все категории
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
    return (
        <Breadcrumb>
            <BreadcrumbList className="sm:text-xs md:text-lg lg:text-xl">
                {activeSubcategoryName ? (
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                asChild
                                className="font-medium underline text-primary cursor-pointer">
                                <Link href={`/${activeCategory}`}>{activeCategoryName}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-primary font-medium">
                            /
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium">
                                {activeSubcategoryName}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                ) : (
                    <BreadcrumbItem>
                        <BreadcrumbPage className="font-medium">
                            {activeCategoryName}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    )
}