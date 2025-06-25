import React from 'react';
import clsx from 'clsx';

interface SectionProps {
    title: string;
    darkMode: boolean;
    children: React.ReactNode;
}

/**
 * Section component renders a titled section with optional dark mode styling.
 *
 * Props:
 * - title: string, the heading text displayed at the top of the section.
 * - darkMode: boolean, toggles dark or light color scheme for text and borders.
 * - children: React.ReactNode, the content to render inside the section.
 *
 * Usage:
 * Wrap content with <Section title="My Title" darkMode={true}>...</Section>
 * to create a styled section with a heading and themed text.
 */


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