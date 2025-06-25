import { fetchAmenities } from '@/Fetch/Filters/fetchFilterSearch';
import fetchMock from 'jest-fetch-mock';
import {ProcessedData} from "@/types/FilterTypes";
fetchMock.enableMocks();

beforeEach(() => {
    fetchMock.resetMocks();
});

describe('fetchAmenities Function', () => {
    const mockSetAmenities = jest.fn();
    const mockSetMapCenter = jest.fn();
    const mockSetLoading = jest.fn();
    const mockSetError = jest.fn();
    const mockData: ProcessedData = {
        districts: [{ id: '1', nome: 'Lisbon District' }],
        municipalityMap: new Map([
            ['1', [{ id: '2', nome: 'Lisbon Municipality', distritoId: '1' }]],
        ]),
        parishMap: new Map([
            ['2', [{ id: '3', nome: 'Santa Maria Maior', concelhoId: '2' }]],
        ]),
    };
    const mockSelectedPoints = ['hospital', 'school'];

    test('early return when parish is empty', async () => {
        await fetchAmenities(
            '',
            '2',
            '1',
            mockSelectedPoints,
            mockData,
            mockSetAmenities,
            mockSetMapCenter,
            mockSetLoading,
            mockSetError
        );
        expect(mockSetAmenities).toHaveBeenCalledWith([]);
        expect(mockSetMapCenter).toHaveBeenCalledWith(null);
        expect(mockSetLoading).not.toHaveBeenCalled();
        expect(mockSetError).not.toHaveBeenCalled();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    test('early return when selectedPoints is empty', async () => {
        await fetchAmenities(
            '3',
            '2',
            '1',
            [],
            mockData,
            mockSetAmenities,
            mockSetMapCenter,
            mockSetLoading,
            mockSetError
        );
        expect(mockSetAmenities).toHaveBeenCalledWith([]);
        expect(mockSetMapCenter).toHaveBeenCalledWith(null);
        expect(mockSetLoading).not.toHaveBeenCalled();
        expect(mockSetError).not.toHaveBeenCalled();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    test('fetches amenities successfully and updates state', async () => {
        const mockResponse = {
            amenities: [{ id: '1', name: 'Hospital', lat: 38.7, lon: -9.1 }],
            center: { lat: 38.7, lon: -9.1 },
        };
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));
        await fetchAmenities(
            '3',
            '2',
            '1',
            mockSelectedPoints,
            mockData,
            mockSetAmenities,
            mockSetMapCenter,
            mockSetLoading,
            mockSetError
        );
        expect(fetchMock).toHaveBeenCalledWith('/api/map/amenities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                parish: 'Santa Maria Maior',
                municipality: 'Lisbon Municipality',
                district: 'Lisbon District',
                points: mockSelectedPoints,
            }),
        });
        expect(mockSetLoading).toHaveBeenCalledWith(true);
        expect(mockSetError).toHaveBeenCalledWith(null);
        expect(mockSetAmenities).toHaveBeenCalledWith(mockResponse.amenities);
        expect(mockSetMapCenter).toHaveBeenCalledWith(mockResponse.center);
        expect(mockSetLoading).toHaveBeenCalledWith(false);
    });



});