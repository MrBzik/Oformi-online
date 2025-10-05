import {CollectionConfig} from "payload";
import {isSuperAdmin} from "@/lib/access";
import {Category, Tag} from "@/payload-types";

export const Products : CollectionConfig = {
    slug: "products",
    access: {
        read : () => true,
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
                description: "Добавте описание услуги"
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
            label: "Категория",
            hooks: {
                beforeValidate: [
                    async ({data, req, originalDoc}) => {
                        if(originalDoc.category === data?.category) {
                            return data?.category;
                        }

                        const tagIds = data?.tags as string[] || []
                        const tags = await Promise.all(
                            tagIds.map((tagId) => {
                                return req.payload.findByID({
                                    collection: "tags",
                                    id: tagId,
                                });
                            })
                        );


                        if(data?.tags){
                            data.tags = tags.filter((tag) => {
                                const tagPopulated = tag as Tag & {category: Category}
                                return tagPopulated.category.id === data.category
                            }).map((tag) => {
                                return tag.id
                            })
                        }

                        return data?.category
                    }
                ]
            }
        },
        {
            name: "tags",
            type: "relationship",
            relationTo: "tags",
            hasMany: true,
            label: "Тэги",
            filterOptions: ({data}) => {
                return {
                    category: {
                        equals: data.category
                    },
                }
            }
        },
        {
            name: "image",
            type: "upload",
            relationTo: "media",
            label: "Изображение в карточк товара (до 1 мб)",
            admin: {
                description: "Соотношение сторон должно быть 1:1 (вы можете редактировать изображение после его загрузке)"
            }
        },
        {
            name: "deadlineMin",
            type: "number",
            required: false,
            label: "Срок выполнения услуги минимум (рабочих дней)"
        },
        {
            name: "deadlineMax",
            type: "number",
            required: false,
            label: "Срок выполнения услуги максимум (рабочих дней)"
        },
        {
            name: "keyWords",
            type: "array",
            maxRows: 10,
            label: "Поисковые ключи",
            labels : {
                singular: "Поисковый ключ",
                plural: "Поисковые ключи"
            },
            fields: [
                {
                    name: "word",
                    type: "text",
                    label: "ключ",
                }
            ],
            admin: {
                description: "Укажите до 10 слов или фраз, по которым услуга должна показываться в поисковой выдаче"
            }
        },
        {
            name: "recommendations",
            type: "array",
            maxRows: 4,
            label: "Рекомендации",
            labels: {
                singular: "Услуги",
                plural: "Рекомендации"
            },
            admin: {
                description: "Список сопутствующих услуг на странице данной услуги (вы можете указать до 4-х единиц)"
            },
            fields: [
                {
                    name: "product",
                    type: "relationship",
                    relationTo: "products",
                    hasMany: false,
                    label: "Услуга",
                    filterOptions: ({data}) => {
                        return {
                            id: {
                                not_equals: data.id
                            },
                        }
                    }
                },
            ]
        },
        {
            name: "totalOrders",
            type: "number",
            label: "Количество заявок",
            defaultValue: 0,
            required: true,
            admin: {
                hidden: true
            },
        },
        {
            name: "ratingCount",
            type: "number",
            label: "Количество оценок",
            defaultValue: 0,
            required: true,
            admin: {
                hidden: true
            },
        },
        {
            name: "totalRating",
            type: "number",
            label: "Общий рейтинг",
            defaultValue: 0,
            required: true,
            admin: {
                hidden: true
            },
        },
        {
            name: "fiveStarsRatings",
            type: "number",
            label: "Оценки 5 звезд",
            defaultValue: 0,
            required: true,
            admin: {
                hidden: true
            },
        },
        {
            name: "fourStarsRatings",
            type: "number",
            label: "Оценки 4 звезды",
            defaultValue: 0,
            required: true,
            admin: {
                hidden: true
            },
        },
        {
            name: "threeStarsRatings",
            type: "number",
            label: "Оценки 3 звезды",
            defaultValue: 0,
            required: true,
            admin: {
                hidden: true
            },
        },
        {
            name: "twoStarsRatings",
            type: "number",
            label: "Оценки 2 звезды",
            defaultValue: 0,
            required: true,
            admin: {
                hidden: true
            },
        },
        {
            name: "oneStarsRatings",
            type: "number",
            label: "Оценки 1 звезда",
            defaultValue: 0,
            required: true,
            admin: {
                hidden: true
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
            defaultValue: true,
            label: "Пройдена модерация",
            access: {
                create : ({req}) => isSuperAdmin(req.user),
                update : ({req}) => isSuperAdmin(req.user),
            },
        },
        {
            name: "isTrusted",
            type: "checkbox",
            defaultValue: false,
            admin: {
                hidden: true
            }
        }
    ],
    hooks: {
        beforeValidate : [
            async ({ data, originalDoc, req }) => {
                if (!originalDoc.tenant && data?.tenant) {
                    const tenant = await req.payload.findByID({
                        collection: "tenants",
                        id: data.tenant,
                    });
                    data.isTrusted = tenant.isTrusted;
                }
                return data;
            }
        ]
    }
}