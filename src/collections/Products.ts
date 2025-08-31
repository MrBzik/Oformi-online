import {CollectionConfig} from "payload";
import {isSuperAdmin} from "@/lib/access";

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
            name: "totalOrders",
            type: "number",
            label: "Количество заявок",
            defaultValue: 0,
            required: true,
            access: {
                create : ({req}) => isSuperAdmin(req.user),
                update : ({req}) => isSuperAdmin(req.user),
            },
        },
        {
            name: "ratingCount",
            type: "number",
            label: "Количество оценок",
            defaultValue: 0,
            required: true,
            access: {
                create : ({req}) => isSuperAdmin(req.user),
                update : ({req}) => isSuperAdmin(req.user),
            },
        },
        {
            name: "totalRating",
            type: "number",
            label: "Общий рейтинг",
            defaultValue: 0,
            required: true,
            access: {
                create : ({req}) => isSuperAdmin(req.user),
                update : ({req}) => isSuperAdmin(req.user),
            },
        },
        {
            name: "fiveStarsRatings",
            type: "number",
            label: "Оценки 5 звезд",
            defaultValue: 0,
            required: true,
            access: {
                create : ({req}) => isSuperAdmin(req.user),
                update : ({req}) => isSuperAdmin(req.user),
            },
        },
        {
            name: "fourStarsRatings",
            type: "number",
            label: "Оценки 4 звезды",
            defaultValue: 0,
            required: true,
            access: {
                create : ({req}) => isSuperAdmin(req.user),
                update : ({req}) => isSuperAdmin(req.user),
            },
        },
        {
            name: "threeStarsRatings",
            type: "number",
            label: "Оценки 3 звезды",
            defaultValue: 0,
            required: true,
            access: {
                create : ({req}) => isSuperAdmin(req.user),
                update : ({req}) => isSuperAdmin(req.user),
            },
        },
        {
            name: "twoStarsRatings",
            type: "number",
            label: "Оценки 2 звезды",
            defaultValue: 0,
            required: true,
            access: {
                create : ({req}) => isSuperAdmin(req.user),
                update : ({req}) => isSuperAdmin(req.user),
            },
        },
        {
            name: "oneStarsRatings",
            type: "number",
            label: "Оценки 1 звезда",
            defaultValue: 0,
            required: true,
            access: {
                create : ({req}) => isSuperAdmin(req.user),
                update : ({req}) => isSuperAdmin(req.user),
            },
        },
        {
            name: "isArchived",
            type: "checkbox",
            defaultValue: false,
            label: "Убрать в архив",
        }
    ]


}