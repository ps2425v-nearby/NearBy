import { renderHook, act } from '@testing-library/react';
import { useHomeState } from '../../../src/components/Map/Hooks/useHomeState';
import { useLocation } from 'react-router-dom';
import { Amenity } from '@/types/FilterTypes';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
}));

describe('useHomeState', () => {
    const mockAmenity: Amenity = {
        id: '1',
        lat: 38.7,
        lon: -9.1,
        tags: { name: 'cafe' },
    };

    beforeEach(() => {
        (useLocation as jest.Mock).mockReturnValue({ state: null });
        localStorage.clear();
        jest.clearAllMocks();
    });

    test('initializes with default state', () => {
        const { result } = renderHook(() => useHomeState());

        expect(result.current.marker).toBeNull();
        expect(result.current.radius).toBe(250);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.previousStreet).toBeNull();
        expect(result.current.refreshKey).toBe(0);
        expect(result.current.amenities).toEqual([]);
        expect(result.current.freguesiaName).toBeNull();
    });

    test('sets marker and radius, and increments refreshKey', () => {
        const { result } = renderHook(() => useHomeState());

        act(() => {
            result.current.setMarkerAndRadius(38.7, -9.1);
        });

        expect(result.current.marker).toEqual({ lat: 38.7, lon: -9.1 });
        expect(result.current.radius).toBe(250); // default if not in markerRadii
        expect(result.current.isLoading).toBe(true);
        expect(result.current.refreshKey).toBe(1);
    });

    test('updates radius and stores it by marker key', () => {
        const { result } = renderHook(() => useHomeState());

        act(() => {
            result.current.setMarkerAndRadius(38.7, -9.1);
        });

        act(() => {
            result.current.updateRadius(300);
        });

        expect(result.current.radius).toBe(300);
    });

    test('loads state from location', () => {
        (useLocation as jest.Mock).mockReturnValue({
            state: {
                lat: 38.7,
                lon: -9.1,
                searchRadius: 500,
                amenities: [mockAmenity],
                parish: 'Alfama',
            },
        });

        const { result } = renderHook(() => useHomeState());

        expect(result.current.marker).toEqual({ lat: 38.7, lon: -9.1 });
        expect(result.current.radius).toBe(500);
        expect(result.current.amenities).toEqual([mockAmenity]);
        expect(result.current.freguesiaName).toBe('Alfama');
    });

    test('resetState clears all state and localStorage', () => {
        const { result } = renderHook(() => useHomeState());

        act(() => {
            result.current.setMarkerAndRadius(38.7, -9.1);
            result.current.setIsLoading(true);
        });

        act(() => {
            result.current.resetState();
        });

        expect(result.current.marker).toBeNull();
        expect(result.current.radius).toBe(250);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.previousStreet).toBeNull();
        expect(result.current.amenities).toEqual([]);
        expect(result.current.freguesiaName).toBeNull();
        expect(localStorage.getItem('lastMarker')).toBeNull();
    });
});
