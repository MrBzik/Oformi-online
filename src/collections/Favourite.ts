import type {CollectionConfig} from "payload";
import {isSuperAdmin} from "@/lib/access";

export const Favourite: CollectionConfig = {
    slug: "favourite",
    access: {
        read: ({req}) => isSuperAdmin(req.user),
        create: ({req}) => isSuperAdmin(req.user),
        update: ({req}) => isSuperAdmin(req.user),
        delete: ({req}) => isSuperAdmin(req.user),
    },

    admin: {
        useAsTitle: "product"
    },

    fields: [
        {
            name: "user",
            type: "relationship",
            relationTo: "users",
            required: true,
            hasMany: false,
            access: {
                read : ({req}) => isSuperAdmin(req.user),
            },
            label: "Пользователь"
        },
        {
            name: "product",
            type: "relationship",
            relationTo: "products",
            required: true,
            hasMany: false,
            label: "Продукт"
        },
    ]
}