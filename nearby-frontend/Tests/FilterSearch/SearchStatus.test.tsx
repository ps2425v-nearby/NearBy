import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchStatus from '../../src/components/FilterSearch/SearchStatus'; // Ajuste o caminho conforme necessário
import { Amenity } from '../../src/types/FilterTypes'; // Ajuste o caminho
import '@testing-library/jest-dom';

// Mock do framer-motion para evitar erros de animação
jest.mock('framer-motion', () => {
    const actual = jest.requireActual('framer-motion');
    return {
        ...actual,
        motion: {
            div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        },
        AnimatePresence: ({ children }: any) => <>{children}</>,
    };
});

// Mock do @headlessui/react
jest.mock('@headlessui/react', () => {
    const actual = jest.requireActual('@headlessui/react');
    return {
        ...actual,
        Disclosure: ({ children }: any) => <div>{children}</div>,
        Transition: ({ children }: any) => <div>{children}</div>,
    };
});

// Mock do @heroicons/react/24/outline
jest.mock('@heroicons/react/24/outline', () => ({
    ChevronDownIcon: () => <svg data-testid="chevron-down-icon" />, // Usamos o data-testid já existente no mock
}));

// Mock do interestedPointsMap
jest.mock('../../src/utils/constants', () => ({
    interestedPointsMap: {
        'supermarket': 'amenity',
        'school': 'amenity',
    },
}));

describe('SearchStatus', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const defaultAmenities: Amenity[] = [
        { id: '1', lat: 38.7223, lon: -9.1393, tags: { name: 'Supermarket', amenity: 'supermarket' } },
        { id: '2', lat: 38.7224, lon: -9.1394, tags: { name: 'School', amenity: 'school' } },
    ];

    test('renders loading state', () => {
        render(<SearchStatus loading={true} error={null} amenities={[]} darkMode={false} />);
        expect(screen.getByText('A carregar pontos de interesse...')).toBeInTheDocument();
        // Não podemos testar o SVG diretamente sem data-testid, mas verificamos o texto associado
        expect(screen.getByText('A carregar pontos de interesse...').closest('div')).toHaveClass('text-blue-600');
        expect(screen.queryByText(/✅/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/❌/i)).not.toBeInTheDocument();
    });

    test('renders error state', () => {
        render(<SearchStatus loading={false} error="Erro ao carregar" amenities={[]} darkMode={false} />);
        expect(screen.getByText('❌ Erro ao carregar')).toBeInTheDocument();
        expect(screen.queryByText('A carregar pontos de interesse...')).not.toBeInTheDocument();
        expect(screen.queryByText(/✅/i)).not.toBeInTheDocument();
    });


    test('applies animation states', async () => {
        const { rerender } = render(<SearchStatus loading={false} error={null} amenities={[]} darkMode={false} />);
        expect(screen.queryByText('A carregar pontos de interesse...')).not.toBeInTheDocument();

        rerender(<SearchStatus loading={true} error={null} amenities={[]} darkMode={false} />);
        await waitFor(() => expect(screen.getByText('A carregar pontos de interesse...')).toBeInTheDocument(), { timeout: 100 });

        rerender(<SearchStatus loading={false} error={null} amenities={[]} darkMode={false} />);
        await waitFor(() => expect(screen.queryByText('A carregar pontos de interesse...')).not.toBeInTheDocument(), { timeout: 100 });
    });
});