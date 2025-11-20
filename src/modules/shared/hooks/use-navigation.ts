import { usePathname } from 'next/navigation';
import {useState, useEffect} from "react";

type Tab = "home" | "profile" | "favorite" | "referral" | "chat";

const useNavigation = () => {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState<Tab>("home");

    useEffect(() => {
        switch (pathname) {
            case '/':
                setActiveTab("home")
                break;
            case '/favourite':
                setActiveTab("favorite")
                break;
            case '/chat':
                setActiveTab("chat")
                break;
            case '/referral':
                setActiveTab("referral")
                break;
            case '/profile':
                setActiveTab("profile")
                break;
            case '/sign-in':
                setActiveTab("profile")
                break;
            case '/sign-up':
                setActiveTab("profile")
                break;
            default:
                break;
        }
    }, [pathname]);

    return {
        activeTab
    };
}

export default useNavigation;
