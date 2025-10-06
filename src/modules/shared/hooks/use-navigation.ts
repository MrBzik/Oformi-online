import { usePathname } from 'next/navigation';
import {useState, useEffect} from "react";

const useNavigation = () => {
    const pathname = usePathname();
    const [isHomeActive, setHomeActive] = useState(false);
    const [isFavoriteActive, setFavoriteActive] = useState(false);
    const [isReferralActive, setReferralActive] = useState(false);
    const [isProfileActive, setProfileActive] = useState(false);

    useEffect(() => {
        setHomeActive(false);
        setFavoriteActive(false);
        setProfileActive(false);

        switch (pathname) {
            case '/':
                setHomeActive(true);
                break;
            case '/favourite':
                setFavoriteActive(true);
                break;
            case '/referral':
                setReferralActive(true);
                break;
            case '/profile':
                setProfileActive(true);
                break;
            case '/sign-in':
                setProfileActive(true);
                break;
            case '/sign-up':
                setProfileActive(true);
                break;
            default:
                setHomeActive(true);
                break;
        }
    }, [pathname]);

    return {
        isHomeActive,
        isFavoriteActive,
        isReferralActive,
        isProfileActive,
    };
}

export default useNavigation;
