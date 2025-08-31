import {CollectionConfig} from "payload";

export const Products : CollectionConfig = {
    slug: "products",
    labels: {
        singular: "Услуга",
        plural: "Услуги"
    },
    admin: {
        useAsTitle: "name",
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
            type: "richText",
            required: true,
            label: "Описание",
            admin: {
                description: "Добавте описание услуги включая изображения если необходимо"
            }
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
            name: "oldPrice",
            type: "number",
            label: "Старая цена",
        },
        {
            name: "category",
            type: "relationship",
            relationTo: "categories",
            hasMany: false,
            required: true,
            label: "Категория"
        },
        {
            name: "tags",
            type: "relationship",
            relationTo: "tags",
            hasMany: true,
            label: "Тэги"
        },
        {
            name: "image",
            type: "upload",
            relationTo: "media",
            label: "Изображение в карточке товара"
        },
        {
            name: "isArchived",
            type: "checkbox",
            defaultValue: false,
            label: "Убрать в архив",
        }
    ]


}