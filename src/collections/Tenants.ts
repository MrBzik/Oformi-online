import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
    slug: 'tenants',
    admin: {
        useAsTitle: 'slug',
    },
    fields: [
        {
            name: "name",
            required: true,
            type: "text",
            label: "Название магазина"
        },
        {
            name: "slug",
            type: "text",
            index: true,
            required: true,
            unique: true,
            admin: {
                description: "Поддомен магазина"
            }
        },
        {
            name: "image",
            type: "upload",
            relationTo: "media"
        },
        {
            name: "ukassaAccountId",
            type: "text",
            required: true,
            admin: {
                readOnly: true,
            }
        },
        {
            name: "ukassaDetailsSubmitted",
            type: "checkbox",
            admin: {
                readOnly: true,
                description: "Вы не можете публиковать услуги до предоставления ЮKassa"
            }
        }
    ],
};
