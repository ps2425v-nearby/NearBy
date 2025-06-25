import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DarkModeProvider } from '../../../src/context/DarkMode/DarkmodeContext';
import { NotificationProvider, useNotification } from '../../../src/context/Notifications/NotificationsContext';
import { Login } from '../../../src/components/joinUs/Login/Login';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../../../src/AuthContext';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { mockAnimationsApi } from 'jsdom-testing-mocks';
import '@testing-library/jest-dom';

// Mock the fetch API
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock Headless UI focus visible property
beforeAll(() => {
    Object.defineProperty(window.HTMLElement.prototype, 'headlessuiFocusVisible', {
        value: undefined,
        writable: true,
    });

});

// Mock useNotification
const mockShowNotification = jest.fn();
jest.mock('../../../src/context/Notifications/NotificationsContext', () => ({
    useNotification: jest.fn(),
    NotificationProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock useAuth
const mockSetToken = jest.fn();
const mockSetUserID = jest.fn();
const mockSetLoggedIn = jest.fn();
jest.mock('../../../src/AuthContext', () => ({
    useAuth: jest.fn(),
}));

// Mock useCookies
const mockSetCookie = jest.fn();
jest.mock('react-cookie', () => ({
    useCookies: jest.fn(() => [null, mockSetCookie]),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

// Mock LoginButton
jest.mock('../../../src/components/joinUs/LoginButton/LoginButton', () => ({ openModal }: { openModal: () => void }) => (
    <button onClick={openModal}>Open Login</button>
));

// Mock fetchLogin
jest.mock('@/Fetch/JoinUs/fetchLogin', () => ({
    fetchLogin: jest.fn(),
}));
import { fetchLogin } from '@/Fetch/JoinUs/fetchLogin';

beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
    (useNotification as jest.Mock).mockReturnValue({ showNotification: mockShowNotification });
    (useAuth as jest.Mock).mockReturnValue({
        setToken: mockSetToken,
        setUserID: mockSetUserID,
        setLoggedIn: mockSetLoggedIn,
    });
    (useCookies as jest.Mock).mockReturnValue([null, mockSetCookie]);
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockReset();
});

describe('Login Component', () => {
    test('Login renders button and opens modal', () => {
        render(
            <BrowserRouter>
                <DarkModeProvider>
                    <NotificationProvider>
                        <Login />
                    </NotificationProvider>
                </DarkModeProvider>
            </BrowserRouter>
        );
        fireEvent.click(screen.getByText('Open Login'));
        expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    test('Login modal closes on close button click', async () => {
        render(
            <BrowserRouter>
                <DarkModeProvider>
                    <NotificationProvider>
                        <Login />
                    </NotificationProvider>
                </DarkModeProvider>
            </BrowserRouter>
        );
        fireEvent.click(screen.getByText('Open Login'));
        fireEvent.click(screen.getByLabelText('Close modal'));
        await waitFor(() => {
            expect(screen.queryByRole('heading', { name: 'Sign In' })).not.toBeInTheDocument();
        }, { timeout: 300 });
    });

    test('Login submits form successfully', async () => {
        (fetchLogin as jest.Mock).mockResolvedValueOnce({ token: 'mock-token', userID: 'mock-user-id' });
        render(
            <BrowserRouter>
                <DarkModeProvider>
                    <NotificationProvider>
                        <Login />
                    </NotificationProvider>
                </DarkModeProvider>
            </BrowserRouter>
        );
        fireEvent.click(screen.getByText('Open Login'));
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'john_doe' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
        await waitFor(() => {
            expect(fetchLogin).toHaveBeenCalledWith({ name: 'john_doe', password: 'password123' });
            expect(mockSetToken).toHaveBeenCalledWith('mock-token');
            expect(mockSetUserID).toHaveBeenCalledWith('mock-user-id');
            expect(mockSetLoggedIn).toHaveBeenCalledWith(true);
            expect(mockSetCookie).toHaveBeenCalledWith('token', 'mock-token');
            expect(localStorageMock.setItem).toHaveBeenCalledWith('username', 'john_doe');
            expect(mockShowNotification).toHaveBeenCalledWith('Logged in successfully!', 'success');
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    test('Login shows error on failed submission', async () => {
        (fetchLogin as jest.Mock).mockRejectedValueOnce(new Error('Login failed'));
        render(
            <BrowserRouter>
                <DarkModeProvider>
                    <NotificationProvider>
                        <Login />
                    </NotificationProvider>
                </DarkModeProvider>
            </BrowserRouter>
        );
        fireEvent.click(screen.getByText('Open Login'));
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'john_doe' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
        await waitFor(() => {
            expect(mockShowNotification).toHaveBeenCalledWith('Username ou Password erradas...', 'error');
        });
    });

    test('Login applies dark mode classes', () => {
        localStorageMock.getItem.mockReturnValue('true');
        render(
            <BrowserRouter>
                <DarkModeProvider>
                    <NotificationProvider>
                        <Login />
                    </NotificationProvider>
                </DarkModeProvider>
            </BrowserRouter>
        );
        fireEvent.click(screen.getByText('Open Login'));
        expect(screen.getByRole('heading', { name: 'Sign In' }).closest('.bg-gray-800')).toHaveClass('bg-gray-800 text-white');
    });
});