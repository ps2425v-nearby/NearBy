import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressIndicator from '../../src/components/FilterSearch/ProgressIndicator';
import '@testing-library/jest-dom';
process.env.BACKEND_URL = 'http://localhost:8080';

describe('ProgressIndicator', () => {
    test('renders 4 steps always', () => {
        render(<ProgressIndicator currentStep={1} />);
        const steps = screen.getAllByText(/^[1-4]$/); // match text '1', '2', '3', '4'
        expect(steps).toHaveLength(4);
    });

    test('highlights current and previous steps with active style', () => {
        render(<ProgressIndicator currentStep={2} />);
        const activeSteps = screen.getAllByText(/^[1-2]$/);
        activeSteps.forEach((step) => {
            expect(step).toHaveClass('bg-blue-500');
            expect(step).toHaveClass('text-white');
        });

        const inactiveSteps = screen.getAllByText(/^[3-4]$/);
        inactiveSteps.forEach((step) => {
            expect(step).toHaveClass('bg-gray-200');
            expect(step).toHaveClass('text-gray-500');
        });
    });

    test('renders dark mode inactive styles correctly', () => {
        render(<ProgressIndicator currentStep={1} darkMode={true} />);

        const step2 = screen.getByText('2');
        expect(step2).toHaveClass('bg-gray-600');
        expect(step2).toHaveClass('text-gray-300');

        const step3 = screen.getByText('3');
        expect(step3).toHaveClass('bg-gray-600');
        expect(step3).toHaveClass('text-gray-300');
    });

    test('renders light mode inactive styles by default', () => {
        render(<ProgressIndicator currentStep={1} />);

        const step3 = screen.getByText('3');
        expect(step3).toHaveClass('bg-gray-200');
        expect(step3).toHaveClass('text-gray-500');
    });

    test('step has correct text content', () => {
        render(<ProgressIndicator currentStep={3} />);
        [1, 2, 3, 4].forEach((num) => {
            expect(screen.getByText(num.toString())).toBeInTheDocument();
        });
    });
});
