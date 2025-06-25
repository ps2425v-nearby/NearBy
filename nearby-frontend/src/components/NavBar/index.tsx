import Navbar from './Navbar';
import React, { useEffect } from 'react';
import { debounce } from '@/utils/debounce';

/**
 * Navbarin component wraps the Navbar component and
 * tracks the window scroll position to update a data attribute on the HTML element.
 *
 * This data attribute (`data-scroll`) can be used for styling or logic based on scroll position.
 *
 * The scroll handler is debounced for performance optimization.
 *
 * @returns {JSX.Element} The wrapped Navbar component.
 */
export const Navbarin: React.FC = () => {
    useEffect(() => {
        /**
         * Updates the 'data-scroll' attribute on the root HTML element with the current vertical scroll position.
         */
        const storeScroll = () => {
            document.documentElement.dataset.scroll = window.scrollY.toString();
        };

        // Add scroll event listener with debounce, passive for better scrolling performance
        document.addEventListener('scroll', debounce(storeScroll), { passive: true });

        // Initialize on mount to capture initial scroll position
        storeScroll();

        // Cleanup listener on unmount
        return () => {
            document.removeEventListener('scroll', debounce(storeScroll));
        };
    }, []);

    return <Navbar />;
};
