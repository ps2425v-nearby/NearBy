/*

import { usePlaceInfo } from '../../../src/components/Map/Hooks/usePlaceInfo';
import { fetchPlace } from '../../../src/components/Fetch/Location/FetchPlace';
import { fetchWeather } from '@/components/Fetch/Wind/FetchWeather';
import { fetchTrafficLevel } from '../../../src/components/Fetch/Traffic/FetchTraffic';
import { fetchZoneIdentier } from '../../../src/components/Fetch/Location/fetchZoneIdentifier';
import { fetchParkingSpaces } from '../../../src/components/Fetch/Parking/fetchParkingSpace';
import { fetchHousingPrices } from '../../../src/components/Fetch/Housing/fetchHousingPrices';
import { fetchCrime } from '../../../src/components/Fetch/Crime/fetchCrime';

import '@testing-library/jest-dom';
import { renderHook, act, waitFor } from '@testing-library/react';
import {Amenity} from "../../../src/types/FilterTypes";

// ✅ Correct mock paths to match import usage
jest.mock('../../../src/components/Fetch/Location/FetchPlace');
jest.mock('@/components/Fetch/Wind/FetchWeather');
jest.mock('../../../src/components/Fetch/Traffic/FetchTraffic');
jest.mock('../../../src/components/Fetch/Location/fetchZoneIdentifier');
jest.mock('../../../src/components/Fetch/Parking/fetchParkingSpace');
jest.mock('../../../src/components/Fetch/Housing/fetchHousingPrices');
jest.mock('../../../src/components/Fetch/Crime/fetchCrime');

describe('usePlaceInfo Hook', () => {
    const mockLat = 38.7;
    const mockLon = -9.1;
    const mockRadius = 250;
    const mockRefreshKey = 0;
    const mockFilters:Amenity[]  = [
        {
            id: 'filter-1',
            lat: 38.7,
            lon: -9.1,
            tags: {
                name: 'restaurant'
            }
        }
    ];



    beforeEach(() => {
        jest.clearAllMocks();
        (fetchPlace as jest.Mock).mockResolvedValue([
            { id: 1, type: 'restaurant', lat: 38.7, lon: -9.1, tags: { amenity: 'restaurant' } },
        ]);
        (fetchWeather as jest.Mock).mockResolvedValue({ speed: 10 });
        (fetchTrafficLevel as jest.Mock).mockResolvedValue('low');
        (fetchZoneIdentier as jest.Mock).mockResolvedValue(['Lisbon']);
        (fetchParkingSpaces as jest.Mock).mockResolvedValue([{ id: 1, lat: 38.7, lon: -9.1 }]);
        (fetchHousingPrices as jest.Mock).mockResolvedValue(1000);
        (fetchCrime as jest.Mock).mockResolvedValue([{ id: 1, type: 'theft' }]);
    });

    test('returns null when lat or lon is undefined', async () => {
        const { result } = renderHook(() => usePlaceInfo(undefined, undefined, mockRadius, mockRefreshKey));
        expect(result.current).toBeNull();
    });

    test('fetches and sets place info correctly', async () => {
        const { result } = renderHook(() =>
            usePlaceInfo(mockLat, mockLon, mockRadius, mockRefreshKey)
        );

        await waitFor(() => {
            expect(result.current).not.toBeNull();
        });

        expect(result.current).toEqual({
            places: [
                { id: 1, type: 'restaurant', lat: 38.7, lon: -9.1, tags: { amenity: 'restaurant' } },
            ],
            wind: { speed: 10 },
            traffic: 'low',
            zone: ['Lisbon'],
            parking: [{ id: 1, lat: 38.7, lon: -9.1 }],
            infractions: [],
            houseValue: 1000,
            crimes: [{ id: 1, type: 'theft' }],
        });

        expect(fetchPlace).toHaveBeenCalledWith(mockLat, mockLon, mockRadius);
        expect(fetchWeather).toHaveBeenCalledWith(mockLat, mockLon);
        expect(fetchTrafficLevel).toHaveBeenCalledWith(mockLat, mockLon, mockRadius);
        expect(fetchZoneIdentier).toHaveBeenCalledWith(mockLat, mockLon);
        expect(fetchParkingSpaces).toHaveBeenCalledWith(mockLat, mockLon, mockRadius);
        expect(fetchHousingPrices).toHaveBeenCalledWith(['Lisbon']);
        expect(fetchCrime).toHaveBeenCalledWith(['Lisbon']);
    });

    test('filters places based on amenities', async () => {
        (fetchPlace as jest.Mock).mockResolvedValue([
            { id: 1, type: 'restaurant', lat: 38.7, lon: -9.1, tags: { amenity: 'restaurant' } },
            { id: 2, type: 'park', lat: 38.7, lon: -9.1, tags: { amenity: 'park' } },
        ]);

        const { result } = renderHook(() =>
            usePlaceInfo(mockLat, mockLon, mockRadius, mockRefreshKey, mockFilters)
        );

        await waitFor(() => {
            expect(result.current).not.toBeNull();
        });

        expect(result.current?.places).toEqual([
            { id: 1, type: 'restaurant', lat: 38.7, lon: -9.1, tags: { amenity: 'restaurant' } },
        ]);
    });

    test('skips fetch if same lat, lon, and radius', async () => {
        const { result, rerender } = renderHook(
            ({ lat, lon, radius }) => usePlaceInfo(lat, lon, radius, mockRefreshKey),
            {
                initialProps: { lat: mockLat, lon: mockLon, radius: mockRadius },
            }
        );

        await waitFor(() => expect(result.current).not.toBeNull());

        // Trigger re-render with same values
        await act(async () => {
            rerender({ lat: mockLat, lon: mockLon, radius: mockRadius });
        });

        // Expect no second fetch
        expect(fetchPlace).toHaveBeenCalledTimes(1);
    });

    test('handles fetch errors gracefully', async () => {
        (fetchPlace as jest.Mock).mockRejectedValue(new Error('Fetch error'));

        const { result } = renderHook(() =>
            usePlaceInfo(mockLat, mockLon, mockRadius, mockRefreshKey)
        );

        await waitFor(() => {
            expect(result.current).toBeNull();
        });
    });
});

 */
