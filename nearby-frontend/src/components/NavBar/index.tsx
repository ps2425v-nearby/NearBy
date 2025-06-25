import Navbar from './Navbar';
import React, { useEffect } from 'react';
import { debounce } from '@/utils/debounce';

export const Navbarin: React.FC = () => {
    useEffect(() => {
        const storeScroll = () => {
            document.documentElement.dataset.scroll = window.scrollY.toString();
        };

        document.addEventListener('scroll', debounce(storeScroll), { passive: true });
        storeScroll();
    }, []);

    return <Navbar />;
};
