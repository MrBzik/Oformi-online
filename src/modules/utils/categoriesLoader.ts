import {BasePayload} from "payload";
import {Category} from "@/payload-types";

interface Props {
    payload: BasePayload,
    category :  string | null | undefined
}

export const categoryLoader = async ({
    payload,
    category
} : Props) => {
    if(category){
        const categoriesData = await payload.find({
            collection: "categories",
            limit: 1,
            depth: 1,
            pagination: false,
            where: {
                slug: {
                    equals: category
                }
            }
        });

        const formattedData = categoriesData.docs.map((doc) => ({
            ...doc,
            subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
                ...(doc as Category),
                subcategories: undefined
            }))
        }))

        const subcategories = [];
        const parentCategory = formattedData[0];
        if (parentCategory) {
            subcategories.push(
                ...parentCategory.subcategories.map(
                    (subcategory) => subcategory.slug
                )
            )

            return [parentCategory.slug, ...subcategories];
        }
    }
}