import type { CollectionConfig } from 'payload'
import {tenantsArrayField} from "@payloadcms/plugin-multi-tenant/fields";
import {isSuperAdmin} from "@/lib/access";

const defaultTenantsArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants",
  tenantsCollectionSlug: "tenants",
  tenantsArrayTenantFieldName: "tenant",
  arrayFieldAccess: {
    read : () => true,
    create : ({req}) => isSuperAdmin(req.user),
    update : ({req}) => isSuperAdmin(req.user),
  },
  tenantFieldAccess: {
    read : () => true,
    create : ({req}) => isSuperAdmin(req.user),
    update : ({req}) => isSuperAdmin(req.user),
  }
})

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: () => true,
    create : ({req}) => isSuperAdmin(req.user),
    delete : ({req}) => isSuperAdmin(req.user),
    update : ({req, id}) => {
      if(isSuperAdmin(req.user)) return true;
      return req.user?.id === id;
    },
  },

  admin: {
    useAsTitle: 'email',
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  auth: {
    verify: {
      generateEmailHTML: ({token}) => {
        return `<a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}">Подтвердить аккаунт</a>`
      }
    },
    forgotPassword: {
      generateEmailHTML: (req) => {
        return `<a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${req?.token}">Сменить пароль</a>`
      }
    }
  },
  fields: [
    {
      name: "username",
      required: true,
      unique: true,
      type: "text"
    },
    {
      admin: {
        position: "sidebar"
      },
      name: "roles",
      type: "select",
      defaultValue: ["user"],
      hasMany: true,
      options: ["super-admin", "user"],
      access: {
        update: ({req}) => isSuperAdmin(req.user),
      }
    },
    {
      ...defaultTenantsArrayField,
      admin: {
        ...(defaultTenantsArrayField?.admin || {}),
        position: "sidebar"
      }
    }
  ],
};
