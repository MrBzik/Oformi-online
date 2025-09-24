import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

interface Props {
    activeCategory? : string | null;
    activeCategoryName? : string | null;
    activeSubcategoryName ? : string | null;
    onNavigate: (categorySlug: string) => void;
}

export const BreadcrumbNavigation = ({
      activeCategory,
      activeCategoryName,
      activeSubcategoryName,
      onNavigate,
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
                                className="font-medium underline text-primary cursor-pointer"
                                onClick={() => onNavigate(activeCategory!)}>
                                <span>{activeCategoryName}</span>
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