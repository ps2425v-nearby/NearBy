import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import FilterActions from '../../src/components/FilterSearch/FilterActions';
import { MapCenter, Amenity } from '../../src/types/FilterTypes';
import '@testing-library/jest-dom';

process.env.BACKEND_URL = 'http://localhost:8080';

// Mock do useNavigate
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

// Mock do framer-motion (para evitar erros com motion.button)
jest.mock('framer-motion', () => ({
    motion: {
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
}));

// Mock dos ícones (assumindo que são componentes SVG)
jest.mock('@heroicons/react/24/outline', () => ({
    XMarkIcon: () => <svg data-testid="x-mark-icon" />,
    MapIcon: () => <svg data-testid="map-icon" />,
}));

describe('FilterActions', () => {
    const mockNavigate = jest.fn();
    const mockResetFilters = jest.fn();

    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        mockNavigate.mockClear();
        mockResetFilters.mockClear();
    });

    const defaultMapCenter: MapCenter = { lat: 38.7223, lon: -9.1393 };
    const defaultAmenities: Amenity[] = [
        { id: '1', lat: 38.7223, lon: -9.1393, tags: { amenity: 'supermarket' } },
    ];
    const defaultData = {
        freguesiasMap: new Map([['Lisboa', [{ id: '1', nome: 'Parish1' }]]]),
    };

    test('renders without crashing', () => {
        render(
            <FilterActions
                mapCenter={defaultMapCenter}
                amenities={defaultAmenities}
                resetFilters={mockResetFilters}
                data={defaultData}
                concelho="Lisboa"
                freguesia="1"
                radius={500}
                darkMode={false}
            />
        );
        expect(screen.getByText('Limpar Filtros')).toBeInTheDocument();
        expect(screen.getByText('Ver no Mapa Grande')).toBeInTheDocument();
    });

    test('does not render "Ver no Mapa Grande" when mapCenter is null', () => {
        render(
            <FilterActions
                mapCenter={null}
                amenities={defaultAmenities}
                resetFilters={mockResetFilters}
                data={defaultData}
                concelho="Lisboa"
                freguesia="1"
                radius={500}
                darkMode={false}
            />
        );
        expect(screen.getByText('Limpar Filtros')).toBeInTheDocument();
        expect(screen.queryByText('Ver no Mapa Grande')).not.toBeInTheDocument();
    });

    test('does not render "Ver no Mapa Grande" when amenities is empty', () => {
        render(
            <FilterActions
                mapCenter={defaultMapCenter}
                amenities={[]}
                resetFilters={mockResetFilters}
                data={defaultData}
                concelho="Lisboa"
                freguesia="1"
                radius={500}
                darkMode={false}
            />
        );
        expect(screen.getByText('Limpar Filtros')).toBeInTheDocument();
        expect(screen.queryByText('Ver no Mapa Grande')).not.toBeInTheDocument();
    });

    test('applies light mode styles correctly', () => {
        render(
            <FilterActions
                mapCenter={defaultMapCenter}
                amenities={defaultAmenities}
                resetFilters={mockResetFilters}
                data={defaultData}
                concelho="Lisboa"
                freguesia="1"
                radius={500}
                darkMode={false}
            />
        );
        const resetButton = screen.getByText('Limpar Filtros');
        const mapButton = screen.getByText('Ver no Mapa Grande');
        expect(resetButton).toHaveClass('bg-red-500 hover:bg-red-600 text-white');
        expect(mapButton).toHaveClass('bg-blue-500 hover:bg-blue-600 text-white');
    });

    test('applies dark mode styles correctly', () => {
        render(
            <FilterActions
                mapCenter={defaultMapCenter}
                amenities={defaultAmenities}
                resetFilters={mockResetFilters}
                data={defaultData}
                concelho="Lisboa"
                freguesia="1"
                radius={500}
                darkMode={true}
            />
        );
        const resetButton = screen.getByText('Limpar Filtros');
        const mapButton = screen.getByText('Ver no Mapa Grande');
        expect(resetButton).toHaveClass('bg-red-700 hover:bg-red-800 text-white');
        expect(mapButton).toHaveClass('bg-blue-700 hover:bg-blue-800 text-white');
    });

    test('calls resetFilters when Limpar Filtros is clicked', () => {
        render(
            <FilterActions
                mapCenter={defaultMapCenter}
                amenities={defaultAmenities}
                resetFilters={mockResetFilters}
                data={defaultData}
                concelho="Lisboa"
                freguesia="1"
                radius={500}
                darkMode={false}
            />
        );
        const resetButton = screen.getByText('Limpar Filtros');
        fireEvent.click(resetButton);
        expect(mockResetFilters).toHaveBeenCalledTimes(1);
    });

    test('navigates with correct state when Ver no Mapa Grande is clicked', () => {
        render(
            <FilterActions
                mapCenter={defaultMapCenter}
                amenities={defaultAmenities}
                resetFilters={mockResetFilters}
                data={defaultData}
                concelho="Lisboa"
                freguesia="1"
                radius={500}
                darkMode={false}
            />
        );
        const mapButton = screen.getByText('Ver no Mapa Grande');
        fireEvent.click(mapButton);
        expect(mockNavigate).toHaveBeenCalledWith('/', {
            state: {
                lat: defaultMapCenter.lat,
                lon: defaultMapCenter.lon,
                parish: 'Parish1',
                amenities: [
                    {
                        id: '1',
                        lat: 38.7223,
                        lon: -9.1393,
                        tags: { amenity: 'supermarket' },
                    },
                ],
                searchRadius: 500,
            },
        });
    });

    test('does not navigate when mapCenter is null and Ver no Mapa Grande is clicked', () => {
        render(
            <FilterActions
                mapCenter={null}
                amenities={defaultAmenities}
                resetFilters={mockResetFilters}
                data={defaultData}
                concelho="Lisboa"
                freguesia="1"
                radius={500}
                darkMode={false}
            />
        );
        // Não há botão "Ver no Mapa Grande" para clicar neste caso
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});