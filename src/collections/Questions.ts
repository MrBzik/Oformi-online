import type { CollectionConfig } from 'payload'
import {isSuperAdmin} from "@/lib/access";

export const Questions: CollectionConfig = {
    slug: "questions",
    access: {
        read : () => true,
        create : ({req}) => isSuperAdmin(req.user),
        update : ({req}) => isSuperAdmin(req.user),
        delete : ({req}) => isSuperAdmin(req.user),
    },
    admin: {
        useAsTitle: "question",
        hidden: ({ user }) => !isSuperAdmin(user),
    },
    fields: [
        {
            name: "question",
            type: "textarea",
            required: true,
            label: "Вопрос"
        },
        {
            name: "product",
            type: "relationship",
            relationTo: "products",
            hasMany: false,
            required: true,
        },
        {
            name: "user",
            type: "relationship",
            relationTo: "users",
            hasMany: false,
            required: true,
        },
        {
            name: "response",
            type: "text",
            required: false
        }
    ],
    labels: {
        singular:'Вопрос',
        plural: 'Вопросы'
    }
};