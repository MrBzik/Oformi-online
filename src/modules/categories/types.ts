import {inferRouterOutputs} from "@trpc/server";
import {AppRouter} from "@/trpc/routers/_app";


export type CategoriesType = inferRouterOutputs<AppRouter>["categories"]['getMany'];
export type CategoryItem = CategoriesType[0]