// Tests/Map/HelpersTest/Spinner.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import { Spinner } from '../../../src/components/Map/Helpers/Spinner';
import '@testing-library/jest-dom'; // garante que os matchers como toHaveClass funcionem
process.env.BACKEND_URL = 'http://localhost:8080';

describe('Spinner', () => {
    it('renders correctly in dark mode', () => {
        const { container } = render(<Spinner darkMode={true} />);
        const spinner = container.firstChild;
        expect(spinner).toHaveClass('border-gray-300', 'border-t-blue-500');
    });

    it('renders correctly in light mode', () => {
        const { container } = render(<Spinner darkMode={false} />);
        const spinner = container.firstChild;
        expect(spinner).toHaveClass('border-gray-400', 'border-t-blue-600');
    });
});
