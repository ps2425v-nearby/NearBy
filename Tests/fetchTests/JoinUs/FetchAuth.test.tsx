import { fetchCreateUser } from '@/Fetch/JoinUs/fetchCreateUser';
import { fetchLogin } from '@/Fetch/JoinUs/fetchLogin';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
    fetchMock.resetMocks();
});

describe('fetchCreateUser Function', () => {
    const payload = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
    };

    test('returns success response for OK status', async () => {
        const mockData = { id: 1, email: 'test@example.com' };
        fetchMock.mockResponseOnce(JSON.stringify(mockData), { status: 201 });
        const result = await fetchCreateUser(payload);
        expect(fetchMock).toHaveBeenCalledWith('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload),
        });
        expect(result).toEqual({ ok: true, status: 201, data: mockData });
    });

    test('returns error response for non-OK status', async () => {
        const mockData = { error: 'Invalid email' };
        fetchMock.mockResponseOnce(JSON.stringify(mockData), { status: 400 });
        const result = await fetchCreateUser(payload);
        expect(fetchMock).toHaveBeenCalledWith('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload),
        });
        expect(result).toEqual({ ok: false, status: 400, data: mockData });
    });
});

describe('fetchLogin Function', () => {
    const payload = {
        name: 'Test User',
        password: 'password123',
    };

    test('returns data for successful login', async () => {
        const mockData = { token: 'abc123', userId: 1 };
        fetchMock.mockResponseOnce(JSON.stringify(mockData), { status: 200 });
        const result = await fetchLogin(payload);
        expect(fetchMock).toHaveBeenCalledWith('/api/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        expect(result).toEqual(mockData);
    });

    test('throws error for failed login with error message', async () => {
        fetchMock.mockResponseOnce('Invalid credentials', { status: 401 });
        await expect(fetchLogin(payload)).rejects.toThrow('Invalid credentials');
        expect(fetchMock).toHaveBeenCalledWith('/api/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    });

    test('throws default error for failed login without message', async () => {
        fetchMock.mockResponseOnce('', { status: 500 });
        await expect(fetchLogin(payload)).rejects.toThrow('Login failed');
        expect(fetchMock).toHaveBeenCalledWith('/api/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    });
});