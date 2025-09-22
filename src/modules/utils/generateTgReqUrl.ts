
export function generateTgReqUrl(botToken: string | null | undefined) {
    return `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=`
}

export const sendTgMessage = async (
    tgUrl: string,
    chatId: string | null | undefined,
    msg: string
) => {
    await fetch(`${tgUrl}${chatId}&text=${msg}`)
};