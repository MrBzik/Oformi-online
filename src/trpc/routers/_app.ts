import { createTRPCRouter } from '../init';
import {categoriesRouter} from "@/modules/categories/server/procedures";
import {authRouter} from "@/modules/auth/server/procedures";
import {productsRouter} from "@/modules/products/server/procedures";
import {tagsRouter} from "@/modules/tags/server/procedures";
import {tenantsRouter} from "@/modules/tenants/server/procedures";
import {reviewsRouter} from "@/modules/reviews/server/procedures";
import {ordersRouter} from "@/modules/orders/server/procedure";
import {favouriteRouter} from "@/modules/favourite/server/procedure";
import {refRouter} from "@/modules/referral/server/procedures";
import {questionsRouter} from "@/modules/questions/server/procedures";
export const appRouter = createTRPCRouter({
   auth: authRouter,
   products: productsRouter,
   categories: categoriesRouter,
   tags: tagsRouter,
   tenants: tenantsRouter,
   reviews: reviewsRouter,
   questions: questionsRouter,
   orders: ordersRouter,
   favourite: favouriteRouter,
   referral : refRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;