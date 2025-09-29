import type { CollectionConfig } from 'payload'
import {isSuperAdmin} from "@/lib/access";

export const Tenants: CollectionConfig = {
    slug: 'tenants',
    access: {
        read : () => true,
        create : ({req}) => isSuperAdmin(req.user),
        delete : ({req}) => isSuperAdmin(req.user),
    },

    admin: {
        useAsTitle: 'slug',
    },
    fields: [
        {
            name: "name",
            required: true,
            unique: true,
            type: "text",
            label: "Название магазина"
        },
        {
            name: "slug",
            type: "text",
            index: true,
            required: true,
            unique: true,
            access: {
                update : ({req}) => isSuperAdmin(req.user),
            },
            label: "Ссылка на магазин",
            admin: {
                description: "Поддомен магазина"
            }
        },

        {
            name: "description",
            type: "text",
            required: false,
            label: "Описание магазина"
        },
        {
            name: "category",
            type: "text",
            required: true,
            label: "Категория услуг",
            defaultValue: ""
        },
        {
            name: "image",
            type: "upload",
            relationTo: "media"
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
        },
        {
            name: "isTrusted",
            type: "checkbox",
            defaultValue: false,
            label: "Проверенный продавец",
            access: {
                create : ({req}) => isSuperAdmin(req.user),
                update : ({req}) => isSuperAdmin(req.user),
            },
        }
        // {
        //     name: "ukassaAccountId",
        //     type: "text",
        //     required: true,
        //     access: {
        //         update : ({req}) => isSuperAdmin(req.user),
        //     },
        //     admin: {
        //         readOnly: true,
        //     }
        // },
        // {
        //     name: "ukassaDetailsSubmitted",
        //     type: "checkbox",
        //     access: {
        //         update : ({req}) => isSuperAdmin(req.user),
        //     },
        //     admin: {
        //         readOnly: true,
        //         description: "Вы не можете публиковать услуги до предоставления ЮKassa"
        //     }
        // }
    ],

    labels: {
        singular:'Настройки магазина',
        plural: 'Настройки магазина'
    }
};
