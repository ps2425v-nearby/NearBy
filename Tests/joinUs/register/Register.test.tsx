import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DarkmodeContext, DarkModeProvider } from '../../../src/context/DarkMode/DarkmodeContext';
import { NotificationProvider, useNotification } from '../../../src/context/Notifications/NotificationsContext';
import ContactUs from '../../../src/components/NavBar/contactUs/Contactus';
import Contactusform from '../../../src/components/NavBar/contactUs/ContactUsForm';
import { ContactFormFields } from '../../../src/components/NavBar/contactUs/ContactUsFormFields';
import { ContactUsFormModal } from '../../../src/components/NavBar/contactUs/ContactUsFormModal';
import { InputField } from '../../../src/components/joinUs/Register/InputField';
import { Register } from '../../../src/components/joinUs/Register/Register';
import { BrowserRouter } from 'react-router-dom';
import { useContext } from 'react';
import { useAuth } from '../../../src/AuthContext';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';

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

// Mock useNotification
const mockShowNotification = jest.fn();
const mockHideNotification = jest.fn();
const notificationContextValue = {
    notification: { show: false, message: '', type: 'info', duration: 5000 },
    showNotification: mockShowNotification,
    hideNotification: mockHideNotification,
};
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

// Mock Navbar
jest.mock('../../../src/components/NavBar/Navbar', () => () => <div>Mocked Navbar</div>);

// Mock fetchCreateUser and fetchLogin
jest.mock('@/Fetch/JoinUs/fetchCreateUser', () => ({
    fetchCreateUser: jest.fn(),
}));
jest.mock('@/Fetch/JoinUs/fetchLogin', () => ({
    fetchLogin: jest.fn(),
}));
import { fetchCreateUser } from '@/Fetch/JoinUs/fetchCreateUser';
import { fetchLogin } from '@/Fetch/JoinUs/fetchLogin';

beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
    (useNotification as jest.Mock).mockReturnValue(notificationContextValue);
    (useAuth as jest.Mock).mockReturnValue({
        setToken: mockSetToken,
        setUserID: mockSetUserID,
        setLoggedIn: mockSetLoggedIn,
    });
    (useCookies as jest.Mock).mockReturnValue([null, mockSetCookie]);
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockReset();
    classListMock.add.mockClear();
    classListMock.remove.mockClear();
});

describe('Contact Form and Register Components', () => {
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

    test('Contactusform toggles dark mode when toggleDarkMode is called', () => {
        let toggleDarkMode: () => void = () => {};
        const MockConsumer = () => {
            const context = useContext(DarkmodeContext);
            if (!context) throw new Error('DarkmodeContext must be used within a DarkModeProvider');
            toggleDarkMode = context.toggleDarkMode;
            return null;
        };

        render(
            <BrowserRouter>
                <DarkModeProvider>
                    <NotificationProvider>
                        <MockConsumer />
                        <Contactusform />
                    </NotificationProvider>
                </DarkModeProvider>
            </BrowserRouter>
        );

        toggleDarkMode();
        expect(localStorageMock.setItem).toHaveBeenCalledWith('darkMode', 'true');
        expect(classListMock.add).toHaveBeenCalledWith('dark');

        toggleDarkMode();
    });

    // ContactFormFields Tests
    test('ContactFormFields renders form fields and submit button', () => {
        const closeModal = jest.fn();
        render(
            <BrowserRouter>
                <DarkModeProvider>
                    <NotificationProvider>
                        <ContactFormFields closeModal={closeModal} />
                    </NotificationProvider>
                </DarkModeProvider>
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
                <DarkModeProvider>
                    <NotificationProvider>
                        <ContactFormFields closeModal={closeModal} />
                    </NotificationProvider>
                </DarkModeProvider>
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
                <DarkModeProvider>
                    <NotificationProvider>
                        <ContactFormFields closeModal={closeModal} />
                    </NotificationProvider>
                </DarkModeProvider>
            </BrowserRouter>
        );
        const submitButton = screen.getByRole('button', { name: 'Enviar Mensagem' });
        expect(submitButton).toBeDisabled();
    });

    test('ContactFormFields enables submit button when all fields are filled', () => {
        const closeModal = jest.fn();
        render(
            <BrowserRouter>
                <DarkModeProvider>
                    <NotificationProvider>
                        <ContactFormFields closeModal={closeModal} />
                    </NotificationProvider>
                </DarkModeProvider>
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
                <DarkModeProvider>
                    <NotificationProvider>
                        <ContactFormFields closeModal={closeModal} />
                    </NotificationProvider>
                </DarkModeProvider>
            </BrowserRouter>
        );
        const nameInput = screen.getByLabelText('O teu nome');
        expect(nameInput).toHaveClass('bg-gray-700 text-white');
        expect(classListMock.add).toHaveBeenCalledWith('dark');
    });

    // ContactUsFormModal Tests

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



    // InputField Tests
    test('InputField renders with label and input', () => {
        const onChange = jest.fn();
        render(
            <InputField
                label="Test Label"
                type="text"
                id="test-id"
                value="test"
                onChange={onChange}
                darkMode={false}
            />
        );
        expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveValue('test');
    });

    test('InputField updates value on change', () => {
        const onChange = jest.fn();
        render(
            <InputField
                label="Test Label"
                type="text"
                id="test-id"
                value="test"
                onChange={onChange}
                darkMode={false}
            />
        );
        const input = screen.getByLabelText('Test Label');
        fireEvent.change(input, { target: { value: 'new value' } });
        expect(onChange).toHaveBeenCalled();
    });

    test('InputField applies dark mode classes when darkMode is true', () => {
        const onChange = jest.fn();
        render(
            <InputField
                label="Test Label"
                type="text"
                id="test-id"
                value="test"
                onChange={onChange}
                darkMode={true}
            />
        );
        const input = screen.getByLabelText('Test Label');
        const label = screen.getByText('Test Label');
        expect(input).toHaveClass('bg-gray-700 text-white border-gray-600');
        expect(label).toHaveClass('text-gray-300');
    });

    test('InputField applies light mode classes when darkMode is false', () => {
        const onChange = jest.fn();
        render(
            <InputField
                label="Test Label"
                type="text"
                id="test-id"
                value="test"
                onChange={onChange}
                darkMode={false}
            />
        );
        const input = screen.getByLabelText('Test Label');
        const label = screen.getByText('Test Label');
        expect(input).toHaveClass('bg-white text-black border-gray-300');
        expect(label).toHaveClass('text-gray-700');
    });

    // Register Tests
    test('Register renders form with InputField components and submit button', () => {
        render(
            <BrowserRouter>
                <DarkModeProvider>
                    <NotificationProvider>
                        <Register />
                    </NotificationProvider>
                </DarkModeProvider>
            </BrowserRouter>
        );
        expect(screen.getByLabelText('Email address')).toBeInTheDocument();
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
        expect(screen.getByText('Mocked Navbar')).toBeInTheDocument();
    });

    test('Register updates input values on change', () => {
        render(
            <BrowserRouter>
                <DarkModeProvider>
                    <NotificationProvider>
                        <Register />
                    </NotificationProvider>
                </DarkModeProvider>
            </BrowserRouter>
        );
        const emailInput = screen.getByLabelText('Email address');
        const usernameInput = screen.getByLabelText('Username');
        const passwordInput = screen.getByLabelText('Password');

        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
        fireEvent.change(usernameInput, { target: { value: 'john_doe' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput).toHaveValue('john@example.com');
        expect(usernameInput).toHaveValue('john_doe');
        expect(passwordInput).toHaveValue('password123');
    });


    test('Register enables submit button when all fields are filled', () => {
        render(
            <BrowserRouter>
                <DarkModeProvider>
                    <NotificationProvider>
                        <Register />
                    </NotificationProvider>
                </DarkModeProvider>
            </BrowserRouter>
        );
        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'john_doe' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

        const submitButton = screen.getByRole('button', { name: 'Register' });
        expect(submitButton).not.toBeDisabled();
    });
/*
    test('Register submits form successfully and navigates', async () => {
        (fetchCreateUser as jest.Mock).mockResolvedValueOnce({ ok: true });
        (fetchLogin as jest.Mock).mockResolvedValueOnce({ token: 'mock-token', userID: 'mock-user-id' });

        render(
            <BrowserRouter>
                <DarkModeProvider>
                    <NotificationProvider>
                        <Register />
                    </NotificationProvider>
                </DarkModeProvider>
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'john_doe' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: 'Register' }));

        await waitFor(() => {
            expect(fetchCreateUser).toHaveBeenCalledWith({
                email: 'john@example.com',
                name: 'john_doe',
                password: 'password123',
            });
            expect(fetchLogin).toHaveBeenCalledWith({
                name: 'john_doe',
                password: 'password123',
            });
            expect(mockSetToken).toHaveBeenCalledWith('mock-token');
            expect(mockSetUserID).toHaveBeenCalledWith('mock-user-id');
            expect(mockSetLoggedIn).toHaveBeenCalledWith(true);
            expect(mockSetCookie).toHaveBeenCalledWith('token', 'mock-token');
            expect(localStorageMock.setItem).toHaveBeenCalledWith('username', 'john_doe');
            expect(mockShowNotification).toHaveBeenCalledWith('Registration successful! Enjoy our App!', 'success', undefined);
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    test('Register shows error notification when fields are empty', async () => {
        render(
            <BrowserRouter>
                <DarkModeProvider>
                    <NotificationProvider>
                        <Register />
                    </NotificationProvider>
                </DarkModeProvider>
            </BrowserRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Register' }));

        await waitFor(() => {
            expect(mockShowNotification).toHaveBeenCalledWith('Please fill out all fields.', 'error', undefined);
        });
    });

    test('Register shows error notification when fetchCreateUser fails with 409', async () => {
        (fetchCreateUser as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 409,
        });

        render(
            <BrowserRouter>
                <DarkModeProvider>
                    <NotificationProvider>
                        <Register />
                    </NotificationProvider>
                </DarkModeProvider>
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'john_doe' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: 'Register' }));

        await waitFor(() => {
            expect(mockShowNotification).toHaveBeenCalledWith('Email or Username already exists', 'error', undefined);
        });
    });

    test('Register shows error notification when fetchCreateUser fails with other error', async () => {
        (fetchCreateUser as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            data: { message: 'Server error' },
        });

        render(
            <BrowserRouter>
                <DarkModeProvider>
                    <NotificationProvider>
                        <Register />
                    </NotificationProvider>
                </DarkModeProvider>
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'john_doe' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: 'Register' }));

        await waitFor(() => {
            expect(mockShowNotification).toHaveBeenCalledWith('Server error', 'error', undefined);
        });
    });

    test('Register shows error notification when fetchLogin fails', async () => {
        (fetchCreateUser as jest.Mock).mockResolvedValueOnce({ ok: true });
        (fetchLogin as jest.Mock).mockRejectedValueOnce(new Error('Login failed'));

        render(
            <BrowserRouter>
                <DarkModeProvider>
                    <NotificationProvider>
                        <Register />
                    </NotificationProvider>
                </DarkModeProvider>
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'john_doe' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: 'Register' }));

        await waitFor(() => {
            expect(mockShowNotification).toHaveBeenCalledWith('Login failed', 'error', undefined);
        });
    });

    test('Register applies dark mode classes when darkMode is true', () => {
        localStorageMock.getItem.mockReturnValue('true');
        render(
            <BrowserRouter>
                <DarkModeProvider>
                    <NotificationProvider>
                        <Register />
                    </NotificationProvider>
                </DarkModeProvider>
            </BrowserRouter>
        );
        const container = screen.getByText('Register').closest('.bg-gray-800');
        const emailInput = screen.getByLabelText('Email address');
        expect(container).toHaveClass('bg-gray-800');
        expect(emailInput).toHaveClass('bg-gray-700 text-white border-gray-600');
        expect(classListMock.add).toHaveBeenCalledWith('dark');
    });

 */
});