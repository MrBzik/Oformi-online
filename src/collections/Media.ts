import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: ({ req: { user } }) => {

      if (!user) return true;

      if (user?.roles?.includes("super-admin")) return true;

      return {
        user: {
          equals: user?.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },

    {
      name: "user",
      type: 'text',
      required: true,
      admin: {
        condition: () => false, // hide from admin UI, since we set it automatically
      },
    }

  ],
  upload: true,

  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
      return {
        ...data,
        user: req.user?.id,
      }
      }
    ]
  }

}
