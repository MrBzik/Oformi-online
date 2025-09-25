import {CollectionConfig} from "payload";
import {isSuperAdmin} from "@/lib/access";

export const FilterGroups : CollectionConfig = {
    slug : "filterGroups",
    admin: {
        useAsTitle: "name",
        hidden: ({user}) => !isSuperAdmin(user)
    },
    labels: {
        singular: "Фильтр",
        plural: "Фильтры"
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
            name: "category",
            type: "relationship",
            relationTo: "categories",
            hasMany: true,
            label: "Категория"
        },
        {
            name: "tags",
            type: "relationship",
            relationTo: "tags",
            hasMany: true,
            label: "Объединяет группу тэгов"
        }
    ],
}