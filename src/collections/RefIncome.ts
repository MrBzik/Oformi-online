import {CollectionConfig} from "payload";
import {isSuperAdmin} from "@/lib/access";

export const RefIncome: CollectionConfig = {
    slug: "refIncome",
    labels: {
        singular: "Доход реферала",
        plural: "Доход рефералов"
    },
    admin: {
        hidden: ({user}) => !isSuperAdmin(user),
    },
    fields: [
        {
            name: "user",
            type: "relationship",
            relationTo: "users",
            required: true,
            hasMany: false,
            label: "Реферал"
        },
        {
            name: "income",
            type: "number",
            required: true,
            label: "Доход"
        },
        {
            name: "date",
            type: "date",
            required: true,
            label: "Дата"
        }
    ]
}