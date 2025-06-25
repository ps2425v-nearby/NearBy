import { fetchHousingPrices } from '@/Fetch/Housing/fetchHousingPrices';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
    fetchMock.resetMocks();
});

describe('fetchHousingPrices Function', () => {
    test('returns 0 when locationData is empty', async () => {
        const result = await fetchHousingPrices([]);
        expect(result).toBe(0);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    test('returns 0 when locationData is undefined', async () => {
        const result = await fetchHousingPrices(undefined as any);
        expect(result).toBe(0);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    test('returns number from direct number response', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(42));
        const result = await fetchHousingPrices(['Lisbon']);
        expect(fetchMock).toHaveBeenCalledWith('/api/housing/prices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(['Lisbon']),
        });
        expect(result).toBe(42);
    });

    test('returns number from object with value', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ value: 42 }));
        const result = await fetchHousingPrices(['Lisbon']);
        expect(fetchMock).toHaveBeenCalledWith('/api/housing/prices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(['Lisbon']),
        });
        expect(result).toBe(42);
    });

    test('returns 0 for non-OK response', async () => {
        fetchMock.mockResponseOnce('Server error', { status: 500 });
        const result = await fetchHousingPrices(['Lisbon']);
        expect(fetchMock).toHaveBeenCalledWith('/api/housing/prices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(['Lisbon']),
        });
        expect(result).toBe(0);
    });

    test('returns 0 for HTML response', async () => {
        fetchMock.mockResponseOnce('<html lang="AA">Error</html>');
        const result = await fetchHousingPrices(['Lisbon']);
        expect(fetchMock).toHaveBeenCalledWith('/api/housing/prices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(['Lisbon']),
        });
        expect(result).toBe(0);
    });

    test('returns 0 for invalid JSON', async () => {
        fetchMock.mockResponseOnce('not json');
        const result = await fetchHousingPrices(['Lisbon']);
        expect(fetchMock).toHaveBeenCalledWith('/api/housing/prices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(['Lisbon']),
        });
        expect(result).toBe(0);
    });

    test('returns 0 for non-numeric data', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ value: 'invalid' }));
        const result = await fetchHousingPrices(['Lisbon']);
        expect(fetchMock).toHaveBeenCalledWith('/api/housing/prices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(['Lisbon']),
        });
        expect(result).toBe(0);
    });
});