import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PointsOfInterest from '../../src/components/FilterSearch/PointsOfInterest';
import '@testing-library/jest-dom';

// Mock do mapa usado no componente
jest.mock('../../src/utils/constants', () => ({
    interestedPointsMap: {
        Escolas: true,
        Hospitais: true,
        Parques: true,
        Restaurantes: true,
    },
}));

describe('PointsOfInterest', () => {
    const defaultProps = {
        parish: 'Some Parish',
        searchQuery: '',
        selectedPoints: [],
        setSearchQuery: jest.fn(),
        setSelectedPoints: jest.fn(),
        darkMode: false,
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('does not render if parish is not set', () => {
        const { container } = render(<PointsOfInterest {...defaultProps} parish="" />);
        expect(container.firstChild).toBeNull();
    });

    test('renders search input and all checkboxes', () => {
        render(<PointsOfInterest {...defaultProps} />);
        expect(screen.getByPlaceholderText(/pesquisar/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Selecionar Todos/)).toBeInTheDocument();
        expect(screen.getByText('Escolas')).toBeInTheDocument();
        expect(screen.getByText('Hospitais')).toBeInTheDocument();
        expect(screen.getByText('Parques')).toBeInTheDocument();
        expect(screen.getByText('Restaurantes')).toBeInTheDocument();
    });

    test('filters points based on search query', () => {
        render(<PointsOfInterest {...defaultProps} searchQuery="par" />);
        expect(screen.queryByText('Parques')).toBeInTheDocument();
        expect(screen.queryByText('Escolas')).not.toBeInTheDocument();
    });

    test('shows "Nenhum ponto encontrado" when no match', () => {
        render(<PointsOfInterest {...defaultProps} searchQuery="xyz" />);
        expect(screen.getByText(/nenhum ponto encontrado/i)).toBeInTheDocument();
    });

    test('calls setSearchQuery on input change', () => {
        render(<PointsOfInterest {...defaultProps} />);
        fireEvent.change(screen.getByPlaceholderText(/pesquisar/i), {
            target: { value: 'Hosp' },
        });
        expect(defaultProps.setSearchQuery).toHaveBeenCalledWith('Hosp');
    });

    test('handles individual checkbox selection', () => {
        render(<PointsOfInterest {...defaultProps} selectedPoints={['Escolas']} />);
        fireEvent.click(screen.getByText('Hospitais'));
        expect(defaultProps.setSelectedPoints).toHaveBeenCalledWith(['Escolas', 'Hospitais']);
    });

    test('"Selecionar Todos" checkbox selects all when checked', () => {
        render(<PointsOfInterest {...defaultProps} />);
        fireEvent.click(screen.getByLabelText(/Selecionar Todos/));
        expect(defaultProps.setSelectedPoints).toHaveBeenCalledWith([
            'Escolas',
            'Hospitais',
            'Parques',
            'Restaurantes',
        ]);
    });

    test('"Selecionar Todos" checkbox deselects all when unchecked', () => {
        render(
            <PointsOfInterest
                {...defaultProps}
                selectedPoints={['Escolas', 'Hospitais', 'Parques', 'Restaurantes']}
            />
        );
        fireEvent.click(screen.getByLabelText(/Selecionar Todos/));
        expect(defaultProps.setSelectedPoints).toHaveBeenCalledWith([]);
    });

    test('renders with dark mode styles', () => {
        render(<PointsOfInterest {...defaultProps} darkMode={true} />);
        expect(screen.getByText('Escolas')).toHaveClass('text-gray-200');
    });
});
