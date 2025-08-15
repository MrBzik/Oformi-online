import {CollectionConfig} from "payload";

export const Tags : CollectionConfig = {
    slug : "tags",
    admin: {
        useAsTitle: "name"
    },
    labels: {
        singular: "Тэги",
        plural: "Тэг"
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
        }
    ],
}