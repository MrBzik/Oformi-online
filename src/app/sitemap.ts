import {MetadataRoute} from "next";
import {getPayload} from "payload";
import config from "@payload-config";
import {Category, Product, Tenant} from "@/payload-types";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL!

export default async function sitemap() : Promise<MetadataRoute.Sitemap> {

    const payload = await getPayload({config});

    const categories = await payload.find({
        collection: "categories",
        pagination: false
    })

    const categoryPages = categories.docs.map((doc) => {

        const category = doc as Category & {parent: Category | null | undefined}

        return {
            url: `${baseUrl}/${category.parent ? category.parent.slug + "/" : ""}${category.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1
        }
    }) as MetadataRoute.Sitemap;

    const products = await payload.find({
        collection: "products",
        pagination: false,
        where: {
            and: [
                {
                    isVerified: {
                        equals: true
                    }
                },
                {
                    "tenant.isVerified": {
                        equals: true
                    }
                }
            ]
        }
    })

    const tenants = new Set<string>();

    const productPages = products.docs.map((doc) => {
        const product = doc as Product & {tenant: Tenant};
        tenants.add(product.tenant.slug)
        return {
            url: `${baseUrl}/tenants/${product.tenant.slug}/products/${product.id}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1
        }
    }) as MetadataRoute.Sitemap;

    const tenantPages = Array.from(tenants).map((tenantSlug) => {
        return {
            url: `${baseUrl}/tenants/${tenantSlug}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1
        }
    }) as MetadataRoute.Sitemap;

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1
        },
        {
            url: `${baseUrl}/favourite`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1
        },
        {
            url: `${baseUrl}/referral`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1
        },
        {
            url: `${baseUrl}/sign-in`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8
        },
        {
            url: `${baseUrl}/sign-up`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8
        },
        {
            url: `${baseUrl}/profile`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1
        },
        ...categoryPages,
        ...productPages,
        ...tenantPages
    ]
}