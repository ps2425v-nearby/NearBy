import { renderHook, act } from '@testing-library/react';
import { usePlaceInfo, PlaceInfoState } from '@/components/Map/Hooks/usePlaceInfo';
import { fetchPlace } from '@/Fetch/Location/FetchPlace';
import { fetchZoneIdentier } from '@/Fetch/Location/fetchZoneIdentifier';
import { fetchHousingPrices } from '@/Fetch/Housing/fetchHousingPrices';
import '@testing-library/jest-dom';
import {ParkingSpaceType} from "@/types/parkingSpaceType";
import {CrimeType} from "@/types/CrimeType";
import {Amenity} from "@/types/FilterTypes";

// Mock dependencies
jest.mock('@/Fetch/Location/FetchPlace');
jest.mock('@/Fetch/Location/fetchZoneIdentifier');
jest.mock('@/Fetch/Housing/fetchHousingPrices');

describe('usePlaceInfo Hook', () => {
    const mockPlaceData = {
        places: [
            { lat: 38.7, lon: -9.1, tags: { name: 'Cafe', amenity: 'cafe' } },
            { lat: 38.8, lon: -9.2, tags: { name: 'Park', amenity: 'park' } },
        ],
        wind: { temp: 20, condition: 'Sunny' },
        trafficLevel: 'Low',
        crimes: [ { city: 'Lisboa', type: 'Theft', valor: 5 } ],
        parkingSpaces: [ { type: 'Public', id: 1, lat: 38.7, lon: -9.1, tags: { name: 'Parking Lot' } }],
    };
    const mockZone = ['Lisboa'];
    const mockHousingPrice = '300000';

    beforeEach(() => {
        jest.clearAllMocks();
        (fetchPlace as jest.Mock).mockResolvedValue(mockPlaceData);
        (fetchZoneIdentier as jest.Mock).mockResolvedValue(mockZone);
        (fetchHousingPrices as jest.Mock).mockResolvedValue(mockHousingPrice);
    });

    test('returns null when lat or lon is undefined', async () => {
        const { result } = renderHook(() => usePlaceInfo(undefined, undefined, 250, 0, []));

        expect(result.current).toBeNull();
        expect(fetchPlace).not.toHaveBeenCalled();
        expect(fetchZoneIdentier).not.toHaveBeenCalled();
        expect(fetchHousingPrices).not.toHaveBeenCalled();
    });

    test('fetches and sets place info correctly', async () => {
        const { result } = renderHook(() => usePlaceInfo(38.7, -9.1, 250, 0, []));

        await act(async () => {
            // Wait for useEffect to complete
        });

        const expectedState: PlaceInfoState = {
            places: mockPlaceData.places, // deve ser any[]
            weather: mockPlaceData.wind,  // deve ser any
            traffic: 'Low',
            zone: mockZone, // deve ser string[]
            parking: mockPlaceData.parkingSpaces as ParkingSpaceType[],
            houseValue: 300000,
            crimes: mockPlaceData.crimes as CrimeType[],
        };

        expect(result.current).toEqual(expectedState);
        expect(fetchPlace).toHaveBeenCalledWith(38.7, -9.1, 250);
        expect(fetchZoneIdentier).toHaveBeenCalledWith(38.7, -9.1);
        expect(fetchHousingPrices).toHaveBeenCalledWith(mockZone);
    });



    test('filters places based on provided amenities', async () => {
        const filters: Amenity[] = [
            { id: '1', lat: 38.7, lon: -9.1, tags: { name: 'Cafe', amenity: 'cafe' } },
        ];
        const { result } = renderHook(() => usePlaceInfo(38.7, -9.1, 250, 0, filters));

        await act(async () => {
            // Wait for useEffect to complete
        });

        const expectedState: PlaceInfoState = {
            places: [mockPlaceData.places[0]], // Only Cafe should be included
            weather: mockPlaceData.wind,
            traffic: 'Low',
            crimes: mockPlaceData.crimes,
            zone: mockZone,
            parking: mockPlaceData.parkingSpaces,
            houseValue: 300000,
        };

        expect(result.current).toEqual(expectedState);
    });

    test('avoids redundant fetches when lat, lon, and radius are unchanged', async () => {
        const { result, rerender } = renderHook(
            ({ lat, lon, radius }) => usePlaceInfo(lat, lon, radius, 0, []),
            { initialProps: { lat: 38.7, lon: -9.1, radius: 250 } }
        );

        await act(async () => {
            // Wait for initial useEffect to complete
        });

        expect(fetchPlace).toHaveBeenCalledTimes(1);

        rerender({ lat: 38.7, lon: -9.1, radius: 250 });

        expect(fetchPlace).toHaveBeenCalledTimes(1); // No additional calls
        expect(result.current).not.toBeNull();
    });

    test('refetches when refreshKey changes', async () => {
        const { result, rerender } = renderHook(
            ({ refreshKey }) => usePlaceInfo(38.7, -9.1, 250, refreshKey, []),
            { initialProps: { refreshKey: 0 } }
        );

        await act(async () => {
            // Wait for initial useEffect to complete
        });

        expect(fetchPlace).toHaveBeenCalledTimes(1);

        rerender({ refreshKey: 1 });

        await act(async () => {
            // Wait for useEffect to complete
        });

        expect(fetchPlace).toHaveBeenCalledTimes(1);
    });

    test('handles fetch errors gracefully', async () => {
        (fetchPlace as jest.Mock).mockRejectedValue(new Error('Fetch error'));
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const { result } = renderHook(() => usePlaceInfo(38.7, -9.1, 250, 0, []));

        await act(async () => {
            // Wait for useEffect to complete
        });

        expect(result.current).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao carregar dados da localização:', expect.any(Error));
        consoleErrorSpy.mockRestore();
    });

    test('handles empty zone for housing prices', async () => {
        (fetchZoneIdentier as jest.Mock).mockResolvedValue([]);

        const { result } = renderHook(() => usePlaceInfo(38.7, -9.1, 250, 0, []));

        await act(async () => {
            // Wait for useEffect to complete
        });

        expect(result.current?.houseValue).toBe(0);

    });

    test('handles null fetchPlace response', async () => {
        (fetchPlace as jest.Mock).mockResolvedValue(null);

        const { result } = renderHook(() => usePlaceInfo(38.7, -9.1, 250, 0, []));

        await act(async () => {
            // Wait for useEffect to complete
        });

        expect(result.current?.places).toEqual([]);
        expect(result.current?.weather).toBeUndefined();
        expect(result.current?.traffic).toBe('');
        expect(result.current?.crimes).toBeUndefined();
        expect(result.current?.parking).toEqual([]);
    });
});