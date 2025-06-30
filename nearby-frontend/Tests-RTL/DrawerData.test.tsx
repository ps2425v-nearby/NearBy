import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Data from '../src/components/NavBar/Drawerdata'; // ajusta o caminho conforme tua estrutura
import '@testing-library/jest-dom';

process.env.BACKEND_URL = 'http://localhost:8080';

describe('Data component', () => {
    beforeEach(() => {
        render(
            <Router>
                <Data />
            </Router>
        );
    });


    test('button Contact Us is rendered with correct class', () => {
        const button = screen.getByRole('button', { name: 'Contact Us' });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('bg-navyblue');
    });


});
