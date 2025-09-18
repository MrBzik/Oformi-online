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
import {resendAdapter} from "@payloadcms/email-resend";
import {Favourite} from "@/collections/Favourite";
import {s3Storage} from "@payloadcms/storage-s3";

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  email: resendAdapter({
    defaultFromAddress: 'admin@oformi.online',
    defaultFromName: 'Авторизация аккаунта',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  i18n: {
    fallbackLanguage: "ru",
    supportedLanguages: {ru}
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    
    components: {
      afterNavLinks: [`/components/payload/back-to-site.tsx`],
      beforeLogin: [`/components/payload/login-brand.tsx`],
      afterLogin: [`/components/payload/back-to-site.tsx`],
      beforeDashboard: [`/components/payload/dashboard-header.tsx`],
    }
  },
  collections: [Users, Media, Categories, Products, Tags, Tenants, Reviews, Orders, Favourite],
  upload: {
    limits: {
      fileSize: 1000000
    }
  },
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
        ...defaultFeatures.filter((feature) => feature.key !== "relationship" && feature.key !==  "upload"),
        HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
    ]
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
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
    // vercelBlobStorage({
    //   enabled: true,
    //   collections: {
    //     media: true
    //   },
    //   token: process.env.BLOB_READ_WRITE_TOKEN
    // })
      s3Storage({
        collections: {
          media: true
        },
        bucket: process.env.S3_BUCKET || "",
        config: {
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.S3_SECRET || '',
          },
          region: "auto",
          endpoint: process.env.S3_ENDPOINT,
        }
      })
  ],
})
