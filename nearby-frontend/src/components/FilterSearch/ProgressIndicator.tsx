import React from 'react';

interface ProgressIndicatorProps {
    currentStep: number;
    darkMode?: boolean;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, darkMode }) => (
    <div className="flex justify-center space-x-4 mb-6">
        {[1, 2, 3, 4].map((step) => (
            <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step
                        ? 'bg-blue-500 text-white'
                        : darkMode
                            ? 'bg-gray-600 text-gray-300'
                            : 'bg-gray-200 text-gray-500'
                }`}
            >
                {step}
            </div>
        ))}
    </div>
);

export default ProgressIndicator;