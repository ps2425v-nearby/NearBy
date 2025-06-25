import {render, screen, fireEvent, waitFor, renderHook} from '@testing-library/react';
import { DarkModeProvider } from '../../../src/context/DarkMode/DarkmodeContext';
import LoginButton from '../../../src/components/joinUs/LoginButton/LoginButton';
import { useLoginStatus } from '../../../src/components/joinUs/LoginButton/useLoginStatus';
import { useDarkModeSafe } from '../../../src/components/joinUs/LoginButton/useDarkModeSafe';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../../../src/AuthContext';
import { CookiesProvider, useCookies } from 'react-cookie';
import { mockAnimationsApi } from 'jsdom-testing-mocks';
import '@testing-library/jest-dom';
import React, {useContext} from "react";

// Mock fetch API
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.location.reload
const reloadMock = jest.fn();
Object.defineProperty(window, 'location', {
    value: { reload: reloadMock },
    writable: true,
});

// Mock Headless UI focus visible property
beforeAll(() => {
    Object.defineProperty(window.HTMLElement.prototype, 'headlessuiFocusVisible', {
        value: undefined,
        writable: true,
    });
});

// Mock useAuth
const mockSetToken = jest.fn();
const mockSetUserID = jest.fn();
jest.mock('../../../src/AuthContext', () => ({
    useAuth: jest.fn(),
}));

// Mock useCookies
const mockRemoveCookie = jest.fn();
jest.mock('react-cookie', () => ({
    useCookies: jest.fn(),
    CookiesProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock DarkmodeContext
const mockDarkModeContext = {
    darkMode: false,
    toggleDarkMode: jest.fn(),
};
jest.mock('../../../src/context/DarkMode/DarkmodeContext', () => {
    const React = require('react'); // Importa React aqui
    const actual = jest.requireActual('../../../src/context/DarkMode/DarkmodeContext');
    return {
        ...actual,
        DarkmodeContext: React.createContext({
            darkMode: false,
            toggleDarkMode: jest.fn(),
        }),
    };
});


// Mock React.useContext
const useContextSpy = jest.spyOn({ useContext }, 'useContext');

beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
    (useAuth as jest.Mock).mockReturnValue({
        setToken: mockSetToken,
        setUserID: mockSetUserID,
    });
    (useCookies as jest.Mock).mockReturnValue([{ token: null }, jest.fn(), mockRemoveCookie]);
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockReset();
    localStorageMock.removeItem.mockReset();
    reloadMock.mockReset();
    // Default mock for DarkmodeContext
    useContextSpy.mockImplementation((context) => {
        if (context === require('../../../src/context/DarkMode/DarkmodeContext').DarkmodeContext) {
            return mockDarkModeContext;
        }
        return undefined;
    });
});

describe('LoginButton and Hooks', () => {
    const renderWithProviders = (ui: React.ReactElement) =>
        render(
            <BrowserRouter>
                <CookiesProvider>
                    <DarkModeProvider>
                        {ui}
                    </DarkModeProvider>
                </CookiesProvider>
            </BrowserRouter>
        );

    test('LoginButton renders when logged out', () => {
        const openModal = jest.fn();
        renderWithProviders(<LoginButton openModal={openModal} />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(screen.getByAltText('User Icon')).toHaveAttribute('src', '/images/user-icon.png');
        expect(screen.queryByText(/Bem-vindo/)).not.toBeInTheDocument();
    });

    test('LoginButton renders when logged in', () => {
        (useCookies as jest.Mock).mockReturnValue([{ token: 'mock-token' }, jest.fn(), mockRemoveCookie]);
        localStorageMock.getItem.mockReturnValue('john_doe');
        const openModal = jest.fn();
        renderWithProviders(<LoginButton openModal={openModal} />);
        expect(screen.getByAltText('Logout Icon')).toHaveAttribute('src', '/images/logout-icon.png');
    });

    test('LoginButton triggers openModal when logged out', () => {
        const openModal = jest.fn();
        renderWithProviders(<LoginButton openModal={openModal} />);
        fireEvent.click(screen.getByRole('button'));
        expect(openModal).toHaveBeenCalled();
        expect(mockRemoveCookie).not.toHaveBeenCalled();
    });

    test('LoginButton triggers handleLogout when logged in', async () => {
        (useCookies as jest.Mock).mockReturnValue([{ token: 'mock-token' }, jest.fn(), mockRemoveCookie]);
        localStorageMock.getItem.mockReturnValue('john_doe');
        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
        const openModal = jest.fn();
        renderWithProviders(<LoginButton openModal={openModal} />);
        fireEvent.click(screen.getByRole('button'));
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/logout', { method: 'POST', credentials: 'include' });
            expect(mockRemoveCookie).toHaveBeenCalledWith('token');
            expect(mockSetToken).toHaveBeenCalledWith(null);
            expect(mockSetUserID).toHaveBeenCalledWith(null);
            expect(localStorageMock.removeItem).toHaveBeenCalledWith('username');
            expect(reloadMock).toHaveBeenCalled();
        });
    });

    test('LoginButton applies dark mode classes', () => {
        useContextSpy.mockImplementation((context) => {
            if (context === require('../../../src/context/DarkMode/DarkmodeContext').DarkmodeContext) {
                return { ...mockDarkModeContext, darkMode: true };
            }
            return undefined;
        });
        const openModal = jest.fn();
        renderWithProviders(<LoginButton openModal={openModal} />);
        const button = screen.getByRole('button');
        expect(screen.getByAltText('User Icon')).toHaveClass('w-6 h-6 transition-transform duration-200 group-hover:scale-110');
    });

    test('useLoginStatus returns correct status', () => {
        (useCookies as jest.Mock).mockReturnValue([{ token: 'mock-token' }, jest.fn(), mockRemoveCookie]);
        localStorageMock.getItem.mockReturnValue('john_doe');
        const { result } = renderHook(() => useLoginStatus(), {
            wrapper: ({ children }) => (
                <CookiesProvider>
                    <BrowserRouter>{children}</BrowserRouter>
                </CookiesProvider>
            ),
        });
        expect(result.current.isLoggedIn).toBe(true);
        expect(result.current.username).toBe('john_doe');
    });

    test('useLoginStatus handles logout error', async () => {
        (useCookies as jest.Mock).mockReturnValue([{ token: 'mock-token' }, jest.fn(), mockRemoveCookie]);
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Logout failed'));
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        const { result } = renderHook(() => useLoginStatus(), {
            wrapper: ({ children }) => (
                <CookiesProvider>
                    <BrowserRouter>{children}</BrowserRouter>
                </CookiesProvider>
            ),
        });
        await result.current.handleLogout();
        expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao fazer logout:', expect.any(Error));
        consoleErrorSpy.mockRestore();
    });



});