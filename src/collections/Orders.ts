import {CollectionConfig} from "payload";
import {isSuperAdmin} from "@/lib/access";

export const Orders: CollectionConfig = {
    slug: "orders",
    access: {
        read : () => true,
        create : ({req}) => isSuperAdmin(req.user),
        update : ({req}) => isSuperAdmin(req.user),
        delete : ({req}) => isSuperAdmin(req.user),
    },
    admin: {
        useAsTitle: "product"
    },
    fields: [
        {
            name: "user",
            type: "relationship",
            relationTo: "users",
            required: false,
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
        {
            name: "email",
            type: "text",
            required: true,
            label: "Почта для связи"
        },
        {
            name: "username",
            type: "text",
            required: true,
            label: "Имя покупателя"
        },
        {
            name: "referral",
            type: "text",
            required: false,
            admin: {
                hidden: true
            }
        },
        {
            name: "refPercentage",
            type: "number",
            required: false,
            admin: {
                hidden: true
            }
        },
        {
            name: "phone",
            type: "text",
            required: false,
            label: "Номер покупателя"
        },
        {
            name: "telegram",
            type: "text",
            required: false,
        },
    ],
    labels: {
        singular:'Заявка',
        plural: 'Заявки'
    }
}