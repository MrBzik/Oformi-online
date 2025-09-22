import {CollectionConfig} from "payload";
import {isSuperAdmin} from "@/lib/access";

export const Tags : CollectionConfig = {
    slug : "tags",
    access: {
        read : () => true,
        update : ({req}) => isSuperAdmin(req.user),
        delete : ({req}) => isSuperAdmin(req.user),
    },
    admin: {
        useAsTitle: "name"
    },
    labels: {
        singular: "Тэг",
        plural: "Тэги"
    },
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
            label: "Название",
            unique: true
        },
        {
            name: "products",
            type: "relationship",
            relationTo: "products",
            hasMany: true,
            label: "Услуги"
        },
        {
            name: "category",
            type: "relationship",
            relationTo: "categories",
            hasMany: true,
            label: "Категория"
        }
    ],
}