/*
import { render, screen, fireEvent } from '@testing-library/react';
import { LeftColumn } from '../../src/components/Map/LeftColumn'; // Ajuste o caminho conforme necessário
import { PlaceType } from '@/types/PlaceType'; // Ajuste o caminho conforme necessário
import '@testing-library/jest-dom';

// Helper function to create a Map for tags
const createTagsMap = (tags: Record<string, string>) => new Map(Object.entries(tags));

describe('LeftColumn Component', () => {
    // Props padrão para os testes
    const defaultProps = {
        radius: 1000,
        places: [
            {
                type: 'node',
                id: 1,
                lat: 40.7128,
                lon: -74.0060,
                tags: createTagsMap({ name: 'Central Park', amenity: 'park', access: 'public' }),
            },
            {
                type: 'node',
                id: 2,
                lat: 40.7129,
                lon: -74.0061,
                tags: createTagsMap({ shop: 'coffee', brand: 'Starbucks' }),
            },
        ] as PlaceType[],
        darkMode: false,
        onSave: jest.fn(),
        onComment: jest.fn(),
        commentsMap:{}
    };

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    test('renders correctly with default props', () => {
        render(<LeftColumn{...defaultProps} />);

        // Verifica o título com o raio
        expect(screen.getByText(/Locais relevantes num raio de 1000 m:/)).toBeInTheDocument();

        // Verifica os locais renderizados
        expect(screen.getByText('Central Park')).toBeInTheDocument();
        expect(screen.getByText(/40\.712800, -74\.006000/)).toBeInTheDocument();
        expect(screen.getByText(/amenity: park/)).toBeInTheDocument();
        expect(screen.getByText(/access: public/)).toBeInTheDocument();

        expect(screen.getByText('Coffee')).toBeInTheDocument(); // Nome capitalizado de "shop: coffee"
        expect(screen.getByText(/40\.712900, -74\.006100/)).toBeInTheDocument();
        expect(screen.getByText(/shop: coffee/)).toBeInTheDocument();
        expect(screen.getByText(/brand: Starbucks/)).toBeInTheDocument();

        // Verifica os botões
        expect(screen.getByText('💾 Guardar Localização')).toBeInTheDocument();
        expect(screen.getByText('💬 Adicionar Comentário')).toBeInTheDocument();
    });

    test('applies dark mode styles correctly', () => {
        render(<LeftColumn {...defaultProps} darkMode={true} />);

        const container = screen.getByTestId('left-column');
        expect(container).toHaveClass('border-gray-500 bg-gray-800 text-white');

        const title = screen.getByText(/Locais relevantes num raio de 1000 m:/);
        expect(title).toHaveClass('text-white');

        const place = screen.getByText('Central Park').closest('li');
        expect(place).toHaveClass('border-gray-600 bg-gray-700');

        const saveButton = screen.getByText('💾 Guardar Localização');
        expect(saveButton).toHaveClass('bg-blue-600 text-white');

        const commentButton = screen.getByText('💬 Adicionar Comentário');
        expect(commentButton).toHaveClass('bg-gray-700 text-white');
    });

    test('displays "Local desconhecido" when place has no name, amenity, shop, or tourism', () => {
        const props = {
            ...defaultProps,
            places: [
                {
                    type: 'node',
                    id: 3,
                    lat: 40.7128,
                    lon: -74.0060,
                    tags: createTagsMap({ access: 'private' }),
                },
            ] as PlaceType[],
        };
        render(<LeftColumn {...props} />);

        expect(screen.getByText('Local desconhecido')).toBeInTheDocument();
    });

    test('handles Map type for tags correctly', () => {
        const props = {
            ...defaultProps,
            places: [
                {
                    type: 'node',
                    id: 4,
                    lat: 40.7128,
                    lon: -74.0060,
                    tags: new Map([
                        ['name', 'Central Park'],
                        ['amenity', 'park'],
                    ]),
                },
            ] as PlaceType[],
        };
        render(<LeftColumn {...props} />);

        expect(screen.getByText('Central Park')).toBeInTheDocument();

    });

    test('calls onSave when save button is clicked', () => {
        render(<LeftColumn {...defaultProps} />);
        const saveButton = screen.getByText('💾 Guardar Localização');
        fireEvent.click(saveButton);
        expect(defaultProps.onSave).toHaveBeenCalledTimes(1);
    });

    test('calls onComment with correct lat/lon when comment button is clicked and lastMarker exists', () => {
        localStorage.setItem('lastMarker', JSON.stringify({ lat: 40.7128, lon: -74.0060 }));
        render(<LeftColumn {...defaultProps} />);
        const commentButton = screen.getByText('💬 Adicionar Comentário');
        fireEvent.click(commentButton);
        expect(defaultProps.onComment).toHaveBeenCalledWith(40.7128, -74.0060);
        expect(defaultProps.onComment).toHaveBeenCalledTimes(1);
    });

    test('does not call onComment when comment button is clicked and lastMarker is missing', () => {
        render(<LeftColumn {...defaultProps} />);
        const commentButton = screen.getByText('💬 Adicionar Comentário');
        fireEvent.click(commentButton);
        expect(defaultProps.onComment).not.toHaveBeenCalled();
    });



});*/
