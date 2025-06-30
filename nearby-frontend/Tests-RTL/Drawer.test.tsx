import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Drawer } from '../src/components/NavBar/Drawer'; // ajusta o caminho conforme tua estrutura
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';

process.env.BACKEND_URL = 'http://localhost:8080';

describe('Drawer component', () => {
    const setup = (isOpen = true) => {
        const setIsOpen = jest.fn();
        render(
            <Router>
                <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
                    <div data-testid="drawer-content">Drawer Content</div>
                </Drawer>
            </Router>
        );
        return { setIsOpen };
    };

    test('renders when isOpen is true', () => {
        setup(true);
        expect(screen.getByTestId('drawer-content')).toBeInTheDocument();
        expect(document.querySelector('main')).toHaveClass('opacity-100');
    });

    test('does not show content when isOpen is false', () => {
        setup(false);
        // Element is rendered but not visible
        expect(screen.queryByTestId('drawer-content')).toBeInTheDocument();
        expect(document.querySelector('main')).toHaveClass('opacity-0');
    });

    test('clicking XMarkIcon calls setIsOpen(false)', () => {
        const { setIsOpen } = setup(true);
        const closeButton = screen.getByTestId('close-drawer');
        fireEvent.click(closeButton);
        expect(setIsOpen).toHaveBeenCalledWith(false);
    });



    test('clicking on overlay calls setIsOpen(false)', () => {
        const { setIsOpen } = setup(true);
        const overlay = document.querySelector('section.w-screen')!;
        fireEvent.click(overlay);
        expect(setIsOpen).toHaveBeenCalledWith(false);
    });

    test('clicking on drawer children also calls setIsOpen(false)', () => {
        const { setIsOpen } = setup(true);
        const content = screen.getByTestId('drawer-content');
        fireEvent.click(content);
        expect(setIsOpen).toHaveBeenCalledWith(false);
    });
});
