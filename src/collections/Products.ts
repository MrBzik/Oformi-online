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
            name: "category",
            type: "relationship",
            relationTo: "categories",
            hasMany: false,
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
            label: "Изображение"
        },
        {
            name: "cover",
            type: "upload",
            relationTo: "media",
            label: "Обложка"
        },

        {
            name: "media",
            type: "upload",
            relationTo: "media",
            label: "Медиафайлы",
            admin: {
                description: "Медиафайлы отображаемые на карусели в деталях об услуге. До 3-х штук"
            },
            hasMany: true,
            validate: (value) => {
                if (value && value.length > 3) {
                    return "Вы можете добавить до 4-х медиафайлов"
                }
                return true
            }
        },

        {
            name: "refundPolicy",
            type: "select",
            options: ["30-day", "14-day", "7-day"],
            defaultValue: "30-day",
        },

        {
            name: "isArchived",
            type: "checkbox",
            defaultValue: false,
            label: "Убрать в архив",
        }
    ]


}