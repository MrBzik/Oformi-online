import type { CollectionConfig } from 'payload'
import {isSuperAdmin} from "@/lib/access";

export const Categories: CollectionConfig = {
    slug: "categories",
    access: {
        read : () => true,
        create : ({req}) => isSuperAdmin(req.user),
        update : ({req}) => isSuperAdmin(req.user),
        delete : ({req}) => isSuperAdmin(req.user),
    },
    admin: {
        useAsTitle: "name",
        hidden: ({ user }) => !isSuperAdmin(user),
    },
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
            label: "Название"
        },
        {
            name: "slug",
            type: "text",
            required: true,
            unique: true,
            index: true,
            label: "идентификатор"
        },
        {
            name: "color",
            type: "text",
            label: "Цвет"
        },
        {
            name: "parent",
            type: "relationship",
            relationTo: "categories",
            hasMany: false,
        },
        {
            name: "subcategories",
            type: "join",
            collection: "categories",
            on: "parent",
            hasMany: true
        },
    ],
    labels: {
        singular:'Категория',
        plural: 'Категории'
    }
};