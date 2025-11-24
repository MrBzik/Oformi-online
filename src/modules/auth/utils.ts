import {cookies as getCookies} from "next/dist/server/request/cookies";

interface Props {
    prefix: string;
    value: string;
}

export const generateAuthCookie = async ({
    prefix,
    value,
} : Props) => {
    const cookies = await getCookies();
    cookies.set({
        name: `${prefix}-token`,
        value: value,
        httpOnly: true,
        path: "/",
    })
}

export const generateTestCookie = async () => {
    const cookies = await getCookies();
    cookies.set({
        name: `test-cookie`,
        value: "this is a test cookie",
        httpOnly: true,
        path: "/",
    })
}