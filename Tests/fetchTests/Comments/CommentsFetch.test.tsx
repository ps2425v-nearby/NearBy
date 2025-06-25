import { fetchCommentsByUser } from '@/Fetch/Comments/fetchCommentsByUser';
import { fetchCommentsUploadRequest } from '@/Fetch/Comments/fetchCommentsUpload';
import { fetchDeleteComment } from '@/Fetch/Comments/fetchDeleteComments';
import { fetchUpdateComment } from '@/Fetch/Comments/fetchUpdateComments';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
    fetchMock.resetMocks();
});
export const mockToken = "Na/PrOksdwumZxoTyWMxCA=="

describe('Comments Fetch Functions', () => {
    test('fetchCommentsByUser returns comments array on success', async () => {
        const mockComments = [{ id: 1, content: 'Test comment' }];
        fetchMock.mockResponseOnce(JSON.stringify(mockComments));
        const result = await fetchCommentsByUser(1,mockToken);
        expect(fetchMock).toHaveBeenCalledWith('/api/comments/user/1');
        expect(result).toEqual(mockComments);
    });

    test('fetchCommentsByUser throws error on failure', async () => {
        fetchMock.mockResponseOnce('', { status: 404 });
        await expect(fetchCommentsByUser(1,mockToken)).rejects.toThrow('Failed to fetch comments');
    });

    test('fetchCommentsByUser returns empty array for non-array data', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}));
        const result = await fetchCommentsByUser(1,mockToken);
        expect(result).toEqual([]);
    });

    test('fetchCommentsUploadRequest sends correct POST request', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        const payload = {
            userId: 1,
            locationId: 2,
            placeName: 'Test Place',
            message: 'Test comment',
            token : mockToken
        };
        await fetchCommentsUploadRequest(payload);
        expect(fetchMock).toHaveBeenCalledWith('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: 1,
                placeId: 2,
                placeName: 'Test Place',
                content: 'Test comment',
            }),
        });
    });

    test('fetchDeleteComment deletes comment on success', async () => {
        fetchMock.mockResponseOnce('', { status: 200 });
        const result = await fetchDeleteComment(1,mockToken);
        expect(fetchMock).toHaveBeenCalledWith('/api/comments/1', { method: 'DELETE' });
        expect(result).toBe(true);
    });

    test('fetchDeleteComment throws error on failure', async () => {
        fetchMock.mockResponseOnce('', { status: 500, statusText: 'Internal Server Error' });
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        await expect(fetchDeleteComment(1,mockToken)).rejects.toThrow('An error occurred while deleting the comment.');
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting comment:', expect.any(Error));
        consoleErrorSpy.mockRestore();
    });

    test('fetchUpdateComment updates comment on success', async () => {
        const mockUpdatedComment = { id: 1, content: 'Updated comment' };
        fetchMock.mockResponseOnce(JSON.stringify(mockUpdatedComment));
        const updatedData = {
            userId: 1,
            placeId: 2,
            placeName: 'Updated Place',
            content: 'Updated comment',
        };
        const result = await fetchUpdateComment(1, updatedData,mockToken);
        expect(fetchMock).toHaveBeenCalledWith('/api/comments/1', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });
        expect(result).toEqual(mockUpdatedComment);
    });

    test('fetchUpdateComment throws error on failure', async () => {
        fetchMock.mockResponseOnce('', { status: 400 });
        const updatedData = {
            userId: 1,
            placeId: 2,
            content: 'Updated comment',
        };
        await expect(fetchUpdateComment(1, updatedData,mockToken)).rejects.toThrow('Failed to update comment');
    });
});