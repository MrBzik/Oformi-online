import {cookies as getCookies} from "next/dist/server/request/cookies";

interface Props {
    prefix: string;
    value: string;
}

interface CookiesProps {
    name: string;
    value: string;
    expireDays: number
}

export const generateAuthCookie = async ({
    prefix,
    value,
} : Props) => {

    await generateCookie({
        name: `${prefix}-token`,
        value: value,
        expireDays: 180
    })
}

export const generateCookie = async ({
    name,
    value,
    expireDays
} : CookiesProps) => {
    const cookies = await getCookies();
    cookies.set({
        name: name,
        value: value,
        httpOnly: true,
        path: '/',
        secure: true,
        sameSite: "strict",
        domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * expireDays)
    })

}