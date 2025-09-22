import { GlobalConfig } from 'payload'
import {isSuperAdmin} from "@/lib/access";

export const RefSetting: GlobalConfig = {
    slug: "refSetting",
    label: "Настройки сайта",
    admin: {
        hidden: ({ user }) => !isSuperAdmin(user),
    },
    fields: [
        {
            name: "refPercent",
            type: "number",
            defaultValue: 5,
            required: true,
            label: "Процент выплат по реферальной программе"
        },
        {
            name: "alertsTgBotToken",
            type: "text",
            defaultValue: "",
            label: "Токент ТГ бота для уведомлений"
        },
        {
            name: "adminTgAccounts",
            type: "array",
            label: "тг аккаунты админов",
            fields: [
                {
                    name: "telegramId",
                    type: "text",
                    label: "Telegram ID",
                }
            ]
        }
    ]

}