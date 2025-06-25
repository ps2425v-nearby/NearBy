import React from 'react';
import clsx from 'clsx';

interface SectionProps {
    title: string;
    darkMode: boolean;
    children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, darkMode, children }) => (
    <section>
        <h4
            className={clsx(
                'mb-2 text-lg font-bold border-b pb-1',
                darkMode ? 'text-white border-gray-600' : 'text-gray-800 border-gray-300'
            )}
        >
            {title}
        </h4>
        <div className={clsx(darkMode ? 'text-white' : 'text-gray-700')}>{children}</div>
    </section>
);