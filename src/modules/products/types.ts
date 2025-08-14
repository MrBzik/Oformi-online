import {inferRouterOutputs} from "@trpc/server";
import {AppRouter} from "@/trpc/routers/_app";


export type ProductsList = inferRouterOutputs<AppRouter>["products"]['getMany'];
export type ProductItem = ProductsList[0]