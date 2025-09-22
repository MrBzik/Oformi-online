import type { CollectionConfig } from 'payload'

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
    hidden: true
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