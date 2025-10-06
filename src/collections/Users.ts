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
    tokenExpiration: 2419200,
    verify: {
      generateEmailHTML: ({token}) => {
        return ` <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color:#111;">Здравствуйте!</h2>
        <p>Спасибо, что зарегистрировались в <strong>«Оформи онлайн»</strong>.</p>
        <p>Чтобы подтвердить адрес вашей электронной почты и активировать аккаунт, нажмите на кнопку ниже:</p>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}" 
             style="display:inline-block; padding:12px 20px; background-color:#007bff; color:#fff; text-decoration:none; border-radius:6px; font-weight:bold;">
            Подтвердить аккаунт
          </a>
        </p>
        <p>Если вы не регистрировались в «Оформи онлайн», просто проигнорируйте это письмо.</p>
        <p>С уважением,<br>Команда «Оформи онлайн»</p>
      </div>`
      }
    },
    forgotPassword: {
      generateEmailHTML: (req) => {
        return `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color:#111;">Здравствуйте!</h2>
        <p>Мы получили запрос на смену пароля для вашей учетной записи в <strong>«Оформи онлайн»</strong>.</p>
        <p>Чтобы задать новый пароль, нажмите на кнопку ниже:</p>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${req?.token}" 
             style="display:inline-block; padding:12px 20px; background-color:#28a745; color:#fff; text-decoration:none; border-radius:6px; font-weight:bold;">
            Сменить пароль
          </a>
        </p>
        <p>Если вы не запрашивали смену пароля, просто проигнорируйте это письмо.</p>
        <p>С уважением,<br>Команда «Оформи онлайн»</p>
      </div>`
      }
    }
  },
  fields: [
    {
      name: "username",
      required: true,
      unique: false,
      type: "text"
    },
    {
      name: "ref",
      type: "text",
      required: false,
    },
    {
      name: "potentialRefIncome",
      type: "number",
      required: true,
      defaultValue: 0,
    },
    {
      name: "tgNotificationsChatId",
      type: "text",
      required: false,
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
