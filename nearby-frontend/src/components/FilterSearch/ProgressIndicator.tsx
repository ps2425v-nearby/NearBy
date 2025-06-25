import React from 'react';

interface ProgressIndicatorProps {
    /**
     * Current step number to highlight in the progress indicator (1-4).
     */
    currentStep: number;

    /**
     * Optional flag to apply dark mode styles.
     */
    darkMode?: boolean;
}

/**
 * ProgressIndicator component displays a horizontal series of steps (1 to 4),
 * highlighting the current step and applying dark/light styling.
 */
const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, darkMode }) => (
    <div className="flex justify-center space-x-4 mb-6">
        {[1, 2, 3, 4].map((step) => (
            <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step
                        ? 'bg-blue-500 text-white' // Active step styles
                        : darkMode
                            ? 'bg-gray-600 text-gray-300' // Inactive step styles in dark mode
                            : 'bg-gray-200 text-gray-500' // Inactive step styles in light mode
                }`}
            >
                {step}
            </div>
        ))}
    </div>
);

export default ProgressIndicator;
