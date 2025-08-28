import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import {HeadingFeature, lexicalEditor} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { ru } from '@payloadcms/translations/languages/ru'

import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import {Categories} from "@/collections/Categories";
import {Products} from "@/collections/Products";
import {Tags} from "@/collections/Tags";
import {Tenants} from "@/collections/Tenants";
import {multiTenantPlugin} from "@payloadcms/plugin-multi-tenant";
import {Reviews} from "@/collections/Reviews";
import {Orders} from "@/collections/Orders";
import {isSuperAdmin} from "@/lib/access";

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  i18n: {
    fallbackLanguage: "ru",
    supportedLanguages: {ru}
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories, Products, Tags, Tenants, Reviews, Orders],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
        ...defaultFeatures,
        HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
    ]
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.MY_DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    multiTenantPlugin({
      collections: {
        products: {},
        media: {},
        orders: {}
      },
      tenantsArrayField: {
        includeDefaultField: false,
      },
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    }),
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true
      },
      token: process.env.BLOB_READ_WRITE_TOKEN
    })
  ],
})
