import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { NotificationProvider } from '../src/context/Notifications/NotificationsContext';
import { DarkmodeContext } from '../src/context/DarkMode/DarkmodeContext';

import Navbar from '../src/components/NavBar/Navbar';
import '@testing-library/jest-dom';
process.env.BACKEND_URL = 'http://localhost:8080';

// Mock dependencies
jest.mock('../src/AuthContext', () => ({
    useAuth: jest.fn().mockReturnValue({ user: { id: '1' } }),
}));
jest.mock('../src/components/NavBar/Drawer', () => ({
    Drawer: ({ isOpen, setIsOpen, children }: any) => (
        <div data-testid="drawer-mock" className={isOpen ? 'open' : 'closed'}>
            {children}
        </div>
    ),
}));
jest.mock('../src/components/NavBar/Drawerdata', () => ({
    __esModule: true,
    default: () => <div data-testid="drawerdata-mock">Drawer Content</div>,
}));
jest.mock('../src/components/NavBar/contactUs/Contactus', () => ({
    __esModule: true,
    default: () => <button data-testid="contactus-mock">Contact Us</button>,
}));
jest.mock('../src/components/NavBar/contactUs/Contactusform', () => ({
    __esModule: true,
    default: () => <button data-testid="contactusform-mock">Contact Us Form</button>,
}));

jest.mock('../src/components/joinUs/Login/Login', () => ({
    __esModule: true,
    Login: () => <button data-testid="login-mock">Login</button>,
}));
jest.mock('@heroicons/react/24/outline', () => ({
    Bars3Icon: () => <svg data-testid="bars-icon" />,
    MoonIcon: () => <svg data-testid="moon-icon" />,
    SunIcon: () => <svg data-testid="sun-icon" />,
}));
jest.mock('@headlessui/react', () => ({
    Disclosure: ({ as: Component = 'div', children }: any) => (
        <Component data-testid="disclosure">{children}</Component>
    ),
}));

describe('Navbar Component', () => {
    const renderWithProviders = (darkMode = false) => {
        const toggleDarkMode = jest.fn();
        return {
            toggleDarkMode,
            ...render(
                <CookiesProvider>
                    <DarkmodeContext.Provider value={{ darkMode, toggleDarkMode }}>
                        <MemoryRouter>
                            <NotificationProvider>
                                <Navbar />
                            </NotificationProvider>
                        </MemoryRouter>
                    </DarkmodeContext.Provider>
                </CookiesProvider>
            ),
        };
    };

    test('renders Navbar with logo', () => {
        renderWithProviders();
        const logo = screen.getByAltText('NearBy Logo');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', '/images/logo.png');
    });

    test('renders Navbar title with link to home', () => {
        renderWithProviders();
        const titleLink = screen.getByText('NearBy');
        expect(titleLink).toBeInTheDocument();
        expect(titleLink.closest('a')).toHaveAttribute('href', '/');
    });

    test('renders all navigation links', () => {
        renderWithProviders();

        expect(screen.getAllByText('Equipa').length).toBeGreaterThan(0);
        expect(screen.getAllByText(/localizações/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText('Procura por Filtros').length).toBeGreaterThan(0);
        expect(screen.getAllByText('GitHub').length).toBeGreaterThan(0);


    });




    test('renders sun icon when in dark mode', () => {
        renderWithProviders(true);
        expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();
    });

    test('renders moon icon when in light mode', () => {
        renderWithProviders(false);
        expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument();
    });

    test('toggles dark mode on icon click', () => {
        const { toggleDarkMode } = renderWithProviders();
        fireEvent.click(screen.getByTestId('moon-icon'));
        expect(toggleDarkMode).toHaveBeenCalledTimes(1);
    });



    test('throws error when DarkmodeContext is not provided', () => {
        const originalError = console.error;
        console.error = jest.fn();
        expect(() => {
            render(
                <CookiesProvider>
                    <MemoryRouter>
                        <NotificationProvider>
                            <Navbar />
                        </NotificationProvider>
                    </MemoryRouter>
                </CookiesProvider>
            );
        }).toThrow('DarkmodeContext must be used within a DarkModeProvider');
        console.error = originalError;
    });

});