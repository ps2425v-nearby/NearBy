import React from 'react';
import clsx from 'clsx';

interface TrafficProps {
    trafficLevel: string;
    darkMode: boolean;
}
/**
 * Traffic component displays a traffic level label with styling that adapts to dark mode.
 *
 * Props:
 * - trafficLevel: string — the traffic information text to display.
 * - darkMode: boolean — toggles between dark and light background/text colors.
 *
 * If trafficLevel is empty or falsy, it displays a fallback error message.
 *
 * Usage:
 * <Traffic trafficLevel="Moderate" darkMode={true} />
 */

export const Traffic: React.FC<TrafficProps> = ({ trafficLevel, darkMode }) => (
    <div
        className={clsx(
            'inline-block px-3 py-1 rounded-full text-sm font-medium',
            darkMode ? 'bg-yellow-800 text-white' : 'bg-yellow-100 text-yellow-800'
        )}
    >
        {trafficLevel || 'Error fetching traffic information.'}
    </div>
);