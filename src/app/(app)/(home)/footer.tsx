import Link from "next/link";

export const Footer = () => {

    return (
        <footer className="flex justify-between items-center font-medium p-6 px-4 lg:px-12">
            <Link
                href="/">
                    <span className="text-lg font-semibold">
                        Оформи онлайн
                    </span>
            </Link>
            <Link href="https://t.me/MessageOoBot?start=sup" className="cursor-pointer text-input-variant">Написать в поддержку</Link>
        </footer>
    )
}