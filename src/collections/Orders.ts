import {CollectionConfig} from "payload";

export const Orders: CollectionConfig = {
    slug: "orders",
    admin: {
        useAsTitle: "name"
    },
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        {
            name: "user",
            type: "relationship",
            relationTo: "users",
            required: false,
            hasMany: false,
        },
        {
            name: "product",
            type: "relationship",
            relationTo: "products",
            required: true,
            hasMany: false,
        },
        {
            name: "email",
            type: "text",
            required: true,
        },
        {
            name: "username",
            type: "text",
            required: true,
        },
        {
            name: "phone",
            type: "text",
            required: false,
        },
        {
            name: "telegram",
            type: "text",
            required: false,
        },
    ],
    labels: {
        singular:'Заявка',
        plural: 'Заявки'
    }
}