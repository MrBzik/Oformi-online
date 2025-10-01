import type { CollectionConfig } from 'payload'
import {isSuperAdmin} from "@/lib/access";

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: "Медиа файл",
    plural: "Медиа файлы"
  },
  access: {
    read : () => true,
  },
  admin: {
    hidden: ({user}) => !isSuperAdmin(user)
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: "Описание изображения"
    },
  ],
  upload: true,
}