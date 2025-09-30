import type { CollectionConfig } from 'payload'
import {isSuperAdmin} from "@/lib/access";
import {generateTgReqUrl, sendTgMessage} from "@/modules/utils/generateTgReqUrl";

export const Tenants: CollectionConfig = {
    slug: 'tenants',
    access: {
        read : () => true,
        create : ({req}) => isSuperAdmin(req.user),
        delete : ({req}) => isSuperAdmin(req.user),
    },

    admin: {
        useAsTitle: 'slug',
    },
    fields: [
        {
            name: "name",
            required: true,
            unique: true,
            type: "text",
            label: "Название магазина"
        },
        {
            name: "slug",
            type: "text",
            index: true,
            required: true,
            unique: true,
            access: {
                update : ({req}) => isSuperAdmin(req.user),
            },
            label: "Ссылка на магазин",
            admin: {
                description: "Поддомен магазина"
            }
        },

        {
            name: "description",
            type: "text",
            required: false,
            label: "Описание магазина"
        },
        {
            name: "category",
            type: "text",
            required: true,
            label: "Категория услуг",
            defaultValue: ""
        },
        {
            name: "image",
            type: "upload",
            relationTo: "media"
        },
        {
            name: "referral",
            type: "text",
            required: false,
            admin: {
                hidden: true
            }
        },
        {
            name: "isVerified",
            type: "checkbox",
            defaultValue: false,
            label: "Пройдена модерация",
            access: {
                create : ({req}) => isSuperAdmin(req.user),
                update : ({req}) => isSuperAdmin(req.user),
            },

        },
        {
            name: "isTrusted",
            type: "checkbox",
            defaultValue: false,
            label: "Проверенный продавец",
            access: {
                create : ({req}) => isSuperAdmin(req.user),
                update : ({req}) => isSuperAdmin(req.user),
            },
        }
        // {
        //     name: "ukassaAccountId",
        //     type: "text",
        //     required: true,
        //     access: {
        //         update : ({req}) => isSuperAdmin(req.user),
        //     },
        //     admin: {
        //         readOnly: true,
        //     }
        // },
        // {
        //     name: "ukassaDetailsSubmitted",
        //     type: "checkbox",
        //     access: {
        //         update : ({req}) => isSuperAdmin(req.user),
        //     },
        //     admin: {
        //         readOnly: true,
        //         description: "Вы не можете публиковать услуги до предоставления ЮKassa"
        //     }
        // }
    ],

    hooks: {
        beforeChange: [
            async ({ data, originalDoc, req }) => {
                if (data?.isVerified && !originalDoc?.isVerified) {

                    const chatId = req.user?.tgNotificationsChatId

                    if(!chatId){
                        return data;
                    }

                    const refSetting = await req.payload.findGlobal({
                        slug: "refSetting"
                    })
                    const tgRequestLink = generateTgReqUrl(refSetting.alertsTgBotToken)

                    const msg = `Ваш магазин прошел модерацию и вы можете добавлять услуги. Подробности на https://oformi.online/profile`
                    await sendTgMessage(tgRequestLink, chatId, msg)
                }
                return data;
            },
        ],
    },

    labels: {
        singular:'Настройки магазина',
        plural: 'Настройки магазина'
    }
};
