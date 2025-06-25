import { fetchDeleteLocation } from '@/Fetch/Location/fetchDeleteLocation';
import { fetchLocationByLatLon } from '@/Fetch/Location/fetchLocationId';
import { fetchZoneIdentier } from '@/Fetch/Location/fetchZoneIdentifier';
import { fetchPlace} from '@/Fetch/Location/FetchPlace';
import fetchMock from 'jest-fetch-mock';
import {mockToken} from "../Comments/CommentsFetch.test";

fetchMock.enableMocks();

beforeEach(() => {
    fetchMock.resetMocks();
});

describe('Location Fetch Functions', () => {
    describe('fetchDeleteLocation', () => {
        test('returns true for successful deletion', async () => {
            fetchMock.mockResponseOnce('', { status: 200 });
            const result = await fetchDeleteLocation('Test Location', 1,mockToken);
            expect(fetchMock).toHaveBeenCalledWith('/api/locations/1', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            expect(result).toBe(true);
        });



        test('returns false for network error', async () => {
            fetchMock.mockRejectOnce(new Error('Network error'));
            const result = await fetchDeleteLocation('Test Location', 1,mockToken);
            expect(result).toBe(false);
        });
    });

    describe('fetchLocationByLatLon', () => {
        test('returns location data with id for successful response', async () => {
            const mockData = { id: 1, name: 'Test Location' };
            fetchMock.mockResponseOnce(JSON.stringify(mockData));
            const result = await fetchLocationByLatLon(38.7, -9.1);
            expect(fetchMock).toHaveBeenCalledWith('/api/locations/retrieve?lat=38.7&lon=-9.1');
            expect(result).toEqual(mockData);
        });

        test('throws error for non-OK response', async () => {
            fetchMock.mockResponseOnce('Not Found', { status: 404 });
            await expect(fetchLocationByLatLon(38.7, -9.1)).rejects.toThrow('Failed to fetch location');
        });

        test('throws error for missing id in response', async () => {
            fetchMock.mockResponseOnce(JSON.stringify({ name: 'Test Location' }));
            await expect(fetchLocationByLatLon(38.7, -9.1)).rejects.toThrow('Location not found');
        });
    });

    describe('fetchZoneIdentier', () => {
        test('returns unique string array for valid response', async () => {
            const mockData = { zone1: 'Residential', zone2: 'Commercial', zone3: 'Residential' };
            fetchMock.mockResponseOnce(JSON.stringify(mockData));
            const result = await fetchZoneIdentier(38.7, -9.1);
            expect(fetchMock).toHaveBeenCalledWith('/api/zones?lat=38.7&lon=-9.1');
            expect(result).toEqual(['Residential', 'Commercial']);
        });

        test('returns error array for non-OK response', async () => {
            fetchMock.mockResponseOnce('Not Found', { status: 404 });
            const result = await fetchZoneIdentier(38.7, -9.1);
            expect(result).toEqual(['Erro ao buscar informações do local.', 'Erro ao buscar informações do local.', 'Erro ao buscar informações do local.']);
        });

        test('returns error array for HTML response', async () => {
            fetchMock.mockResponseOnce('<html>Error</html>');
            const result = await fetchZoneIdentier(38.7, -9.1);
            expect(result).toEqual(['Erro ao buscar informações do local.', 'Erro ao buscar informações do local.', 'Erro ao buscar informações do local.']);
        });

        test('returns error array for invalid JSON', async () => {
            fetchMock.mockResponseOnce('invalid json');
            const result = await fetchZoneIdentier(38.7, -9.1);
            expect(result).toEqual(['Erro ao buscar informações do local.', 'Erro ao buscar informações do local.', 'Erro ao buscar informações do local.']);
        });

        test('returns default array for non-object response', async () => {
            fetchMock.mockResponseOnce(JSON.stringify('invalid'));
            const result = await fetchZoneIdentier(38.7, -9.1);
            expect(result).toEqual(['Desconhecido', 'Desconhecido', 'Desconhecido']);
        });
    });

    describe('fetchPlace', () => {
        test('returns mapped PlaceType array for valid response', async () => {
            const mockData = {
                places: [
                    { id: 1, type: 'restaurant', lat: 38.7, lon: -9.1, tags: { name: 'Test Restaurant' } },
                    { id: 2, type: 'unknown', lat: 38.8, lon: -9.2, tags: {} },
                ],
            };
            fetchMock.mockResponseOnce(JSON.stringify(mockData));
            const result = await fetchPlace(38.7, -9.1, 1000);
            expect(fetchMock).toHaveBeenCalledWith('/api/places?lat=38.7&lon=-9.1&searchRadius=1000');
            expect(result).toEqual([
                { id: 1, type: 'Restaurante', lat: 38.7, lon: -9.1, tags: { name: 'Test Restaurant' } },
                { id: 2, type: 'unknown', lat: 38.8, lon: -9.2, tags: {} },
            ]);
        });

        test('returns empty array for non-OK response', async () => {
            fetchMock.mockResponseOnce('Not Found', { status: 404 });
            const result = await fetchPlace(38.7, -9.1, 1000);
            expect(result).toEqual([]);
        });

        test('returns empty array for HTML response', async () => {
            fetchMock.mockResponseOnce('<html>Error</html>');
            const result = await fetchPlace(38.7, -9.1, 1000);
            expect(result).toEqual([]);
        });

        test('returns empty array for network error', async () => {
            fetchMock.mockRejectOnce(new Error('Network error'));
            const result = await fetchPlace(38.7, -9.1, 1000);
            expect(result).toEqual([]);
        });
    });
});