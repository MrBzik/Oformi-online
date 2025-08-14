import {CollectionConfig} from "payload";

export const Products : CollectionConfig = {
    slug: "products",
    labels: {
        singular: "Услуга",
        plural: "Услуги"
    },
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
            label: "Наименование"
        },
        {
            name: "description",
            type: "text",
            required: true,
            label: "Описание"
        },
        {
            name: "price",
            type: "number",
            required: true,
            label: "Цена",
            admin: {
                description: "Стоимость в рублях"
            }
        },
        {
            name: "category",
            type: "relationship",
            relationTo: "categories",
            hasMany: false,
            label: "Категория"
        },
        {
            name: "image",
            type: "upload",
            relationTo: "media",
            label: "Изображение"
        },
        {
            name: "refundPolicy",
            type: "select",
            options: ["30-day", "14-day", "7-day"],
            defaultValue: "30-day",
        }
    ]


}