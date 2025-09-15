import type { CollectionConfig } from 'payload'
import {isSuperAdmin} from "@/lib/access";

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: "Медиа файл",
    plural: "Медиа файлы"
  },
  access: {
    read : ({req}) => (req.user?.tenants?.length ?? 0) > 0 || isSuperAdmin(req.user),
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