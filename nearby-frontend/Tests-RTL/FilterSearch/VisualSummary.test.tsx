import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import VisualSummary from '../../src/components/FilterSearch/VisualSummary'; // Ajuste o caminho conforme necessário
import '@testing-library/jest-dom';

// Mock do framer-motion para evitar erros de animação
jest.mock('framer-motion', () => {
    const actual = jest.requireActual('framer-motion');
    return {
        ...actual,
        motion: {
            div: ({ children, ...props }: any) => <div {...props} data-testid="visual-summary">{children}</div>,
        },
        AnimatePresence: ({ children }: any) => <>{children}</>,
    };
});

describe('VisualSummary', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Custom text matcher function to handle split text
    const findTextIncludingChildren = (content: string, element: HTMLElement | null) => {
        if (!element) return false;
        return element.textContent?.includes(content) || false;
    };

    test('does not render when all selections are empty', () => {
        render(<VisualSummary districtSelected="" councilSelected="" parishSelected="" pointsSelected={[]} />);
        expect(screen.queryByText(/Distrito:/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Concelho:/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Freguesia:/i)).not.toBeInTheDocument();
    });

    test('renders with all selections in dark mode', () => {
        render(
            <VisualSummary
                districtSelected="Lisboa"
                councilSelected="Lisboa"
                parishSelected="Parish1"
                pointsSelected={['Supermarket', 'School']}
                darkMode={true}
            />
        );
       expect(screen.getByText('Supermarket')).toBeInTheDocument();
        expect(screen.getByText('School')).toBeInTheDocument();
        expect(screen.getByTestId('visual-summary')).toHaveClass('bg-blue-900 text-blue-200');

    });

   test('applies animation states', async () => {
        const { rerender } = render(
            <VisualSummary districtSelected="" councilSelected="" parishSelected="" pointsSelected={[]} />
        );
        expect(screen.queryByTestId('visual-summary')).not.toBeInTheDocument();

        rerender(
            <VisualSummary districtSelected="Lisboa" councilSelected="" parishSelected="" pointsSelected={[]} />
        );
        await waitFor(() => expect(screen.getByTestId('visual-summary')).toBeInTheDocument(), { timeout: 100 });

        rerender(
            <VisualSummary districtSelected="" councilSelected="" parishSelected="" pointsSelected={[]} />
        );
        await waitFor(() => expect(screen.queryByTestId('visual-summary')).not.toBeInTheDocument(), { timeout: 100 });
    });
});