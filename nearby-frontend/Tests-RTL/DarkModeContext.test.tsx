import React from 'react';
import { render, screen } from '@testing-library/react';
import { DarkModeProvider, DarkmodeContext } from '..//src/context/DarkMode/DarkmodeContext';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
process.env.BACKEND_URL = 'http://localhost:8080';

describe('DarkModeContext', () => {
    const TestComponent = () => {
        const context = React.useContext(DarkmodeContext);

        if (!context) return null;

        const { darkMode, toggleDarkMode } = context;

        return (
            <div>
                <p data-testid="mode">{darkMode ? 'dark' : 'light'}</p>
                <button onClick={toggleDarkMode}>Toggle</button>
            </div>
        );
    };

    const renderWithProvider = () =>
        render(
            <DarkModeProvider>
                <TestComponent />
            </DarkModeProvider>
        );

    beforeEach(() => {
        localStorage.clear();
        document.documentElement.classList.remove('dark');
    });

    test('should initialize with darkMode false if not set in localStorage', () => {
        renderWithProvider();
        expect(screen.getByTestId('mode')).toHaveTextContent('light');
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    test('should initialize with darkMode true if set in localStorage', () => {
        localStorage.setItem('darkMode', 'true');
        renderWithProvider();
        expect(screen.getByTestId('mode')).toHaveTextContent('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    test('should toggle dark mode and update localStorage and class list', async () => {
        renderWithProvider();

        const button = screen.getByText('Toggle');
        const mode = screen.getByTestId('mode');

        // Primeiro toggle: ativa darkMode
        await userEvent.click(button);
        expect(mode).toHaveTextContent('dark');
        expect(localStorage.getItem('darkMode')).toBe('true');
        expect(document.documentElement.classList.contains('dark')).toBe(true);

        // Segundo toggle: desativa darkMode
        await userEvent.click(button);
        expect(mode).toHaveTextContent('light');
        expect(localStorage.getItem('darkMode')).toBe('false');
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
});
