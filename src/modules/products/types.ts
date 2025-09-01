import {Media, Product, Tenant} from "@/payload-types";

export function productsPopulated (product: Product){
    return {
        ...product,
        image: product.image as Media | null,
        tenant: product.tenant as Tenant & {image: Media | null},
    }
}