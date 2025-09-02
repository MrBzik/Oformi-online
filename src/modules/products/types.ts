import {Media, Product, Tenant} from "@/payload-types";

import {inferRouterOutputs} from "@trpc/server";
import {AppRouter} from "@/trpc/routers/_app";

export function productsPopulated (product: Product){
    return {
        ...product,
        image: product.image as Media | null,
        tenant: product.tenant as Tenant & {image: Media | null},
    }
}



export type SuggestionsList = inferRouterOutputs<AppRouter>["products"]['getSuggestions'];

