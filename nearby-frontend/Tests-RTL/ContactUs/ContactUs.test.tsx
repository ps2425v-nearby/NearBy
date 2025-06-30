process.env.BACKEND_URL = 'http://localhost:8080';
import { render, screen, fireEvent } from '@testing-library/react';
import {  DarkModeProvider } from '@/context/DarkMode/DarkmodeContext';
import { NotificationProvider, useNotification } from '@/context/Notifications/NotificationsContext';
import ContactUs from '../../src/components/NavBar/contactUs/Contactus';
import Contactusform from '../../src/components/NavBar/contactUs/ContactUsForm';
import { ContactFormFields } from '@/components/NavBar/contactUs/ContactUsFormFields';
import { ContactUsFormModal } from '@/components/NavBar/contactUs/ContactUsFormModal';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import {CookiesProvider} from "react-cookie";

// Mock the fetch API
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock document.documentElement.classList
const classListMock = {
    add: jest.fn(),
    remove: jest.fn(),
    contains: jest.fn(),
};
Object.defineProperty(document, 'documentElement', {
    value: { classList: classListMock },
    writable: true,
});

// Mock Headless UI focus visible property to fix 'headlessuiFocusVisible' error
beforeAll(() => {
    Object.defineProperty(window.HTMLElement.prototype, 'headlessuiFocusVisible', {
        value: undefined,
        writable: true,
    });
});

const mockShowNotification = jest.fn();
const mockHideNotification = jest.fn();

const notificationContextValue = {
    notification: { show: false, message: '', type: 'info', duration: 5000 },
    showNotification: mockShowNotification,
    hideNotification: mockHideNotification,
};

// Mock useNotification hook
jest.mock('../../src/context/Notifications/NotificationsContext', () => ({
    useNotification: jest.fn(),
    NotificationProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
    (useNotification as jest.Mock).mockReturnValue(notificationContextValue);
    localStorageMock.getItem.mockReturnValue(null);
    classListMock.add.mockClear();
    classListMock.remove.mockClear();
});

describe('Contact Form Components', () => {
    // ContactUs Tests
    test('ContactUs renders Contactusform component', () => {
        render(
            <BrowserRouter>
                <DarkModeProvider>
                    <NotificationProvider>
                        <ContactUs />
                    </NotificationProvider>
                </DarkModeProvider>
            </BrowserRouter>
        );
        expect(screen.getByText('Ajuda')).toBeInTheDocument();
    });

    // Contactusform Tests
    test('Contactusform renders button with Ajuda text and contact icon', () => {
        render(
            <BrowserRouter>
                <DarkModeProvider>
                    <NotificationProvider>
                        <Contactusform />
                    </NotificationProvider>
                </DarkModeProvider>
            </BrowserRouter>
        );
        expect(screen.getByText('Ajuda')).toBeInTheDocument();
        expect(screen.getByAltText('Ajuda')).toHaveAttribute('src', '/images/contact-icon.png');
    });


    test('Contactusform applies dark mode classes when darkMode is true', () => {
        localStorageMock.getItem.mockReturnValue('true');
        render(
            <BrowserRouter>
                <DarkModeProvider>
                    <NotificationProvider>
                        <Contactusform />
                    </NotificationProvider>
                </DarkModeProvider>
            </BrowserRouter>
        );
        const button = screen.getByText('Ajuda').closest('button');
        expect(button).toHaveClass('text-gray-300');
        expect(screen.getByAltText('Ajuda')).toHaveClass('filter invert');
        expect(classListMock.add).toHaveBeenCalledWith('dark');
    });



    // ContactFormFields Tests
    test('ContactFormFields renders form fields and submit button', () => {
        const closeModal = jest.fn();
        render(
            <BrowserRouter>
                <CookiesProvider>
                <DarkModeProvider>
                    <NotificationProvider>
                        <ContactFormFields closeModal={closeModal} />
                    </NotificationProvider>
                </DarkModeProvider>
                </CookiesProvider>
            </BrowserRouter>
        );
        expect(screen.getByLabelText('O teu nome')).toBeInTheDocument();
        expect(screen.getByLabelText('O teu email')).toBeInTheDocument();
        expect(screen.getByLabelText('A tua Mensagem')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Enviar Mensagem' })).toBeInTheDocument();
    });

    test('ContactFormFields updates input values on change', () => {
        const closeModal = jest.fn();
        render(
            <BrowserRouter>
                <CookiesProvider>
                <DarkModeProvider>
                    <NotificationProvider>
                        <ContactFormFields closeModal={closeModal} />
                    </NotificationProvider>
                </DarkModeProvider>
                </CookiesProvider>
            </BrowserRouter>
        );
        const nameInput = screen.getByLabelText('O teu nome');
        const emailInput = screen.getByLabelText('O teu email');
        const messageInput = screen.getByLabelText('A tua Mensagem');

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
        fireEvent.change(messageInput, { target: { value: 'Hello!' } });

        expect(nameInput).toHaveValue('John Doe');
        expect(emailInput).toHaveValue('john@example.com');
        expect(messageInput).toHaveValue('Hello!');
    });

    test('ContactFormFields disables submit button when fields are empty', () => {
        const closeModal = jest.fn();
        render(
            <BrowserRouter>
                <CookiesProvider>
                <DarkModeProvider>
                    <NotificationProvider>
                        <ContactFormFields closeModal={closeModal} />
                    </NotificationProvider>
                </DarkModeProvider>
                </CookiesProvider>
            </BrowserRouter>
        );
        const submitButton = screen.getByRole('button', { name: 'Enviar Mensagem' });
        expect(submitButton).toBeDisabled();
    });

    test('ContactFormFields enables submit button when all fields are filled', () => {
        const closeModal = jest.fn();
        render(
            <BrowserRouter>
                <CookiesProvider>
                <DarkModeProvider>
                    <NotificationProvider>
                        <ContactFormFields closeModal={closeModal} />
                    </NotificationProvider>
                </DarkModeProvider>
                </CookiesProvider>
            </BrowserRouter>
        );
        fireEvent.change(screen.getByLabelText('O teu nome'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText('O teu email'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText('A tua Mensagem'), { target: { value: 'Hello!' } });

        const submitButton = screen.getByRole('button', { name: 'Enviar Mensagem' });
        expect(submitButton).not.toBeDisabled();
    });



    test('ContactFormFields applies dark mode classes when darkMode is true', () => {
        const closeModal = jest.fn();
        localStorageMock.getItem.mockReturnValue('true');
        render(
            <BrowserRouter>
               <CookiesProvider>
                <DarkModeProvider>
                    <NotificationProvider>
                        <ContactFormFields closeModal={closeModal} />
                    </NotificationProvider>
                </DarkModeProvider>
               </CookiesProvider>
            </BrowserRouter>
        );
        const nameInput = screen.getByLabelText('O teu nome');
        expect(nameInput).toHaveClass('bg-gray-700 text-white');
        expect(classListMock.add).toHaveBeenCalledWith('dark');
    });



    test('ContactUsFormModal does not render modal when isOpen is false', () => {
        const setIsOpen = jest.fn();
        render(
            <BrowserRouter>
                <DarkModeProvider>
                    <NotificationProvider>
                        <ContactUsFormModal isOpen={false} setIsOpen={setIsOpen} />
                    </NotificationProvider>
                </DarkModeProvider>
            </BrowserRouter>
        );
        expect(screen.queryByText('NearBy')).not.toBeInTheDocument();
    });


});