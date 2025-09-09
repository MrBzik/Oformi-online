import {CollectionConfig} from "payload";
import {isSuperAdmin} from "@/lib/access";

export const Products : CollectionConfig = {
    slug: "products",
    access: {
        read : ({req}) => (req.user?.tenants?.length ?? 0) > 0 || isSuperAdmin(req.user),
    },
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
                description: "Добавте описание услуги (включая изображения до 1 мб)"
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
            label: "Изображение в карточк товара (до 1 мб)"
        },
        {
            name: "recommendProducts",
            type: "relationship",
            relationTo: "products",
            hasMany: true,
            label: "Рекомандации",
            admin: {
                description: "Список сопутствующих услуг на странице данной услуги (вы можете указать до 4-х единиц)"
            },
            validate: (value) => {
                if (value && value.length > 4) {
                    return "Вы можете добавить до 4-х услуг"
                }
                return true
            }
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
        },
        {
            name: "isVerified",
            type: "checkbox",
            defaultValue: false,
            label: "Пройдена модерация",
            access: {
                create : ({req}) => isSuperAdmin(req.user),
                update : ({req}) => isSuperAdmin(req.user),
            },
        }
    ]


}