import { renderHook, act } from '@testing-library/react';
import { useCommentsPopup } from '../../src/components/Comments/PopUp/useCommentsPopUp';
import { useNotification } from '../../src/context/Notifications/NotificationsContext';
import { fetchCommentsUploadRequest } from '@/Fetch/Comments/fetchCommentsUpload';
import { useNavigate } from 'react-router-dom';

// Mocks
jest.mock('../../src/context/Notifications/NotificationsContext', () => ({
    useNotification: jest.fn(),
}));

jest.mock('@/Fetch/Comments/fetchCommentsUpload', () => ({
    fetchCommentsUploadRequest: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

// Setup helpers
const mockShowNotification = jest.fn();
const mockNavigate = jest.fn();
const mockOnClose = jest.fn();

describe('useCommentsPopup', () => {
    beforeEach(() => {
        (useNotification as jest.Mock).mockReturnValue({ showNotification: mockShowNotification });
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        localStorage.setItem('userID', '1');
        jest.clearAllMocks();
        jest.useFakeTimers();
        jest.clearAllMocks();
    });

    const setup = (locationId:number | null = 123, placeName: string | null = 'Lisboa') =>
        renderHook(() =>
            useCommentsPopup({
                locationId,
                placeName,
                onClose: mockOnClose,
            })
        );

    it('should initialize with default state', () => {
        const { result } = setup();

        expect(result.current.message).toBe('');
        expect(result.current.submitting).toBe(false);
        expect(result.current.submitted).toBe(false);
        expect(result.current.isFormDisabled).toBe(true);
        expect(result.current.buttonText).toBe('Submit');
    });

    it('should not submit if required fields are missing', async () => {
        const { result } = setup(null, null);

        await act(() =>
            result.current.handleSubmit({ preventDefault: jest.fn() } as any)
        );

        expect(mockShowNotification).toHaveBeenCalledWith('Please fill all fields', 'warning');
    });

    it('should handle successful submission', async () => {
        (fetchCommentsUploadRequest as jest.Mock).mockResolvedValue({ ok: true });

        const { result } = setup();

        act(() => result.current.setMessage('Hello'));

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: jest.fn() } as any);
        });

        expect(fetchCommentsUploadRequest).toHaveBeenCalledWith({
            userId: 1,
            locationId: 123,
            placeName: 'Lisboa',
            message: 'Hello',
        });

        expect(mockShowNotification).toHaveBeenCalledWith('Comment posted successfully', 'success');

        // Simulate timeout without waiting real time
        jest.runAllTimers();

        expect(mockNavigate).toHaveBeenCalledWith('/comments');
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('should handle 403 response', async () => {
        (fetchCommentsUploadRequest as jest.Mock).mockResolvedValue({ ok: false, status: 403 });

        const { result } = setup();
        act(() => result.current.setMessage('Another comment'));

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: jest.fn() } as any);
        });

        expect(mockShowNotification).toHaveBeenCalledWith(
            "Chegaste ao limite de comentários (Máx 3). Por favor, apaga um comentário para adicionar outro.",
            'warning'
        );
    });

    it('should handle generic error', async () => {
        (fetchCommentsUploadRequest as jest.Mock).mockRejectedValue(new Error('Server error'));

        const { result } = setup();
        act(() => result.current.setMessage('Try again'));

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: jest.fn() } as any);
        });

        expect(mockShowNotification).toHaveBeenCalledWith('Failed to post comment', 'error');
    });
});
