import {RefObject, useEffect, useState} from 'react';

const useScrollThreshold = (ref: RefObject<HTMLDivElement | null>) => {

    const [thresholdReached, setThresholdReached] = useState(false);

    useEffect(() => {

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if(!ref.current){
                return;
            }

            if (currentScrollY > ref.current.getBoundingClientRect().height) {
                setThresholdReached(true);
            } else {
                setThresholdReached(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return thresholdReached;
};

export default useScrollThreshold;