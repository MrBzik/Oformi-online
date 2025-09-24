import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import Link from "next/link";

interface Props {
    parentCategorySlug? : string | null;
    parentCategoryName? : string | null;
    categorySlug ? : string | null;
    categoryName ? : string | null;
}

export const ProductBreadcrumb = ({
                                         parentCategorySlug,
                                         parentCategoryName,
                                         categorySlug,
                                         categoryName
                                     }: Props) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {parentCategorySlug && (
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild className="text-xl font-medium underline text-primary">
                                <Link href={`/${parentCategorySlug}`}>{parentCategoryName}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-primary font-medium text-lg">
                            /
                        </BreadcrumbSeparator>
                    </>
                )}
                <BreadcrumbItem>
                    <BreadcrumbPage className="text-xl font-medium underline">
                        <Link href={`${parentCategorySlug ? "/" + parentCategorySlug : ""}/${categorySlug}`}>{categoryName}</Link>
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}