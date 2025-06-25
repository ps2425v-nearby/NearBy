import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { useCommentsPreview } from '../../src/components/Comments/Preview/useCommentsPreview';
import { useNotification } from '../../src/context/Notifications/NotificationsContext';
import { fetchCommentsByUser } from '@/Fetch/Comments/fetchCommentsByUser';
import { fetchDeleteComment } from '@/Fetch/Comments/fetchDeleteComments';
import { fetchUpdateComment } from '@/Fetch/Comments/fetchUpdateComments';

jest.mock('../../src/context/Notifications/NotificationsContext', () => ({
    useNotification: jest.fn(),
}));

jest.mock('@/Fetch/Comments/fetchCommentsByUser');
jest.mock('@/Fetch/Comments/fetchDeleteComments');
jest.mock('@/Fetch/Comments/fetchUpdateComments');

function HookTestComponent(props: { callback: (hook: ReturnType<typeof useCommentsPreview>) => void }) {
    const hook = useCommentsPreview();
    React.useEffect(() => {
        props.callback(hook);
    }, [hook, props]);
    return null;
}

describe('useCommentsPreview', () => {
    const mockShowNotification = jest.fn();
    let hookState: any = null;

    beforeEach(() => {
        jest.clearAllMocks();
        (useNotification as jest.Mock).mockReturnValue({ showNotification: mockShowNotification });
        localStorage.setItem('userID', '1');
        hookState = null;
    });

    function renderHookComponent() {
        render(<HookTestComponent callback={h => { hookState = h; }} />);
    }

    it('should fetch comments on mount', async () => {
        const mockComments = [
            { id: 1, content: 'Test', placeId: 1, placeName: 'Place', createdAt: new Date().toISOString() },
        ];
        (fetchCommentsByUser as jest.Mock).mockResolvedValue(mockComments);

        renderHookComponent();

        await waitFor(() => expect(hookState.comments).toEqual(mockComments));
        expect(hookState.loading).toBe(false);
    });

    it('should handle error if userID is missing or fetch fails', async () => {
        localStorage.removeItem('userID');
        renderHookComponent();

        await waitFor(() => expect(hookState.loading).toBe(false));
        expect(hookState.comments).toEqual([]);
    });

    it('should delete comment and notify on success', async () => {
        (fetchDeleteComment as jest.Mock).mockResolvedValue({});
        const mockComments = [
            { id: 1, content: 'Test', placeId: 1, placeName: 'Place', createdAt: new Date().toISOString() },
        ];
        (fetchCommentsByUser as jest.Mock).mockResolvedValue(mockComments);

        renderHookComponent();
        await waitFor(() => expect(hookState.comments).toEqual(mockComments));

        await act(async () => {
            await hookState.handleDeleteComment(1);
        });

        expect(hookState.comments).toEqual([]);
        expect(mockShowNotification).toHaveBeenCalledWith('Comentário apagado com sucesso!', 'success');
    });

    it('should notify on delete error', async () => {
        (fetchDeleteComment as jest.Mock).mockRejectedValue(new Error('Error'));
        const mockComments = [
            { id: 1, content: 'Test', placeId: 1, placeName: 'Place', createdAt: new Date().toISOString() },
        ];
        (fetchCommentsByUser as jest.Mock).mockResolvedValue(mockComments);

        renderHookComponent();
        await waitFor(() => expect(hookState.comments).toEqual(mockComments));

        await act(async () => {
            await hookState.handleDeleteComment(1);
        });

        expect(mockShowNotification).toHaveBeenCalledWith('Erro ao apagar o comentário...', 'error');
    });

    it('should edit and save comment successfully', async () => {
        const mockDate = new Date();
        const updatedComment = {
            id: 1,
            content: 'Updated',
            placeId: 1,
            placeName: 'Place',
            createdAt: mockDate.toISOString(),
        };

        (fetchCommentsByUser as jest.Mock).mockResolvedValue([{
            id: 1,
            content: 'Old content',
            placeId: 1,
            placeName: 'Place',
            createdAt: new Date().toISOString(),
        }]);
        (fetchUpdateComment as jest.Mock).mockResolvedValue({ ...updatedComment });

        renderHookComponent();
        await waitFor(() => expect(hookState.comments.length).toBe(1));

        act(() => {
            hookState.handleEditComment(1, 'Updated');
            hookState.setEditedContent('Updated');
        });

        await act(async () => {
            await hookState.handleSaveComment(1);
        });

        expect(hookState.comments[0].content).toBe('Updated');
        expect(mockShowNotification).toHaveBeenCalledWith('Comentário atualizado com sucesso!', 'success');
    });

    it('should notify on save comment error', async () => {
        (fetchCommentsByUser as jest.Mock).mockResolvedValue([{
            id: 1,
            content: 'Old content',
            placeId: 1,
            placeName: 'Place',
            createdAt: new Date().toISOString(),
        }]);
        (fetchUpdateComment as jest.Mock).mockRejectedValue(new Error('Update failed'));

        renderHookComponent();
        await waitFor(() => expect(hookState.comments.length).toBe(1));

        act(() => {
            hookState.handleEditComment(1, 'New content');
            hookState.setEditedContent('New content');
        });

        await act(async () => {
            await hookState.handleSaveComment(1);
        });

        expect(mockShowNotification).toHaveBeenCalledWith('Erro ao atualizar o comentário.', 'error');
    });
});