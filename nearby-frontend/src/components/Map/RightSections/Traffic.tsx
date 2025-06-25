import React from 'react';
import clsx from 'clsx';

interface TrafficProps {
    trafficLevel: string;
    darkMode: boolean;
}

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