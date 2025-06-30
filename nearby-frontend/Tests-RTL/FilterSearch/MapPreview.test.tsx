import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MapPreview from '../../src/components/FilterSearch/MapPreview'; // Ajuste o caminho conforme necessário
import { MapCenter, Amenity } from '@/types/FilterTypes'; // Ajuste o caminho
import '@testing-library/jest-dom';
process.env.BACKEND_URL = 'http://localhost:8080';

// Mock do framer-motion
jest.mock('framer-motion', () => {
    const actual = jest.requireActual('framer-motion');
    return {
        ...actual,
        motion: {
            div: ({ children, ...props }: any) => <div {...props} data-testid="map-preview">{children}</div>,
        },
    };
});

// Mock do react-leaflet para simular renderização
jest.mock('react-leaflet', () => ({
    MapContainer: ({ children, ...props }: any) => <div data-testid="map-container" {...props}>{children}</div>,
    TileLayer: () => <div data-testid="tile-layer" />,
    Marker: ({ position }: any) => <div data-testid="marker" data-position={JSON.stringify(position)} />,
    Circle: ({ center, radius }: any) => <div data-testid="circle" data-center={JSON.stringify(center)} data-radius={radius} />,
}));

// Mock do customMarkerIcon
jest.mock('../../src/utils/leafletConfig', () => ({
    customMarkerIcon: {},
}));

describe('MapPreview', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const defaultMapCenter: MapCenter = { lat: 38.7223, lon: -9.1393 };
    const defaultAmenities: Amenity[] = [
        { id: '1', lat: 38.7223, lon: -9.1393, tags: { name: 'Supermarket', amenity: 'supermarket' } },
        { id: '2', lat: 38.7224, lon: -9.1394, tags: { name: 'School', amenity: 'school' } },
    ];

    test('does not render when mapCenter is null', () => {
        render(<MapPreview mapCenter={null} radius={3000} amenities={defaultAmenities} />);
        expect(screen.queryByTestId('map-preview')).not.toBeInTheDocument();
    });

    test('renders map with correct zoom level for radius 1000', () => {
        render(<MapPreview mapCenter={defaultMapCenter} radius={1000} amenities={defaultAmenities} />);
        const mapContainer = screen.getByTestId('map-container');
        expect(mapContainer).toBeInTheDocument();
        expect(mapContainer).toHaveAttribute('zoom', '15');
        expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
        expect(screen.getByTestId('circle')).toHaveAttribute('data-center', JSON.stringify([38.7223, -9.1393]));
        expect(screen.getByTestId('circle')).toHaveAttribute('data-radius', '1000');
    });

    test('renders map with correct zoom level for radius 4000', () => {
        render(<MapPreview mapCenter={defaultMapCenter} radius={4000} amenities={defaultAmenities} />);
        const mapContainer = screen.getByTestId('map-container');
        expect(mapContainer).toBeInTheDocument();
        expect(mapContainer).toHaveAttribute('zoom', '13');
        expect(screen.getByTestId('circle')).toHaveAttribute('data-radius', '4000');
    });

    test('renders up to 10 amenities as markers', () => {
        const manyAmenities = Array.from({ length: 12 }, (_, i) => ({
            id: i.toString(),
            lat: 38.7223 + i * 0.001,
            lon: -9.1393 + i * 0.001,
            tags: { name: `Point ${i}`, amenity: 'supermarket' },
        }));
        render(<MapPreview mapCenter={defaultMapCenter} radius={3000} amenities={manyAmenities} />);
        const markers = screen.getAllByTestId('marker');
        expect(markers.length).toBe(11); // 1 para mapCenter + 10 amenities
    });

    test('applies animation states', async () => {
        const { rerender } = render(<MapPreview mapCenter={null} radius={3000} amenities={defaultAmenities} />);
        expect(screen.queryByTestId('map-preview')).not.toBeInTheDocument();

        rerender(<MapPreview mapCenter={defaultMapCenter} radius={3000} amenities={defaultAmenities} />);
        await waitFor(() => expect(screen.getByTestId('map-preview')).toBeInTheDocument(), { timeout: 400 });

        rerender(<MapPreview mapCenter={null} radius={3000} amenities={defaultAmenities} />);
        await waitFor(() => expect(screen.queryByTestId('map-preview')).not.toBeInTheDocument(), { timeout: 400 });
    });
});