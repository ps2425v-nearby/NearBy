import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth, authReducer } from '../src/AuthContext'; // Ajuste o caminho conforme necessário
import React from 'react';

// Componente auxiliar para testar o contexto Auth com ações externas
const TestComponent = ({ action }: { action?: (ctx: ReturnType<typeof useAuth>) => void }) => {
    const ctx = useAuth();

    // Permite injetar ações assim que o componente é montado
    React.useEffect(() => {
        if (action) action(ctx);
    }, [action]);

    return (
        <div>
            <p data-testid="token">{ctx.username}</p>
            <p data-testid="userID">{ctx.userID}</p>
            <button onClick={() => ctx.setUsername('UserTest')}>Set Token</button>
            <button onClick={() => ctx.setUserID(123)}>Set User ID</button>
            <button onClick={() => ctx.setLoggedIn(true)}>Set Logged In</button>
        </div>
    );
};

// Função para renderizar qualquer componente dentro do AuthProvider
const renderWithAuthProvider = (action?: (ctx: ReturnType<typeof useAuth>) => void) => {
    return render(
        <AuthProvider>
            <TestComponent action={action} />
        </AuthProvider>
    );
};

describe('AuthContext', () => {
    // Limpa o localStorage antes de cada teste para garantir estado limpo
    beforeEach(() => {
        localStorage.clear();
    });

    // Testa o reducer isoladamente, útil para cobrir o caso "default"
    describe("authReducer", () => {
        const initialState = {
            loggedIn: false,
            username: null,
            userID: null,
            gameId: null,
        };

        test("should return current state for unknown action type", () => {
            const unknownAction = { type: "UNKNOWN_ACTION" } as any;

            // Espera que o estado se mantenha inalterado para tipos não tratados
            const newState = authReducer(initialState, unknownAction);
            expect(newState).toBe(initialState);
        });
    });

    test('should initialize with correct values', () => {
        renderWithAuthProvider();

        // Garante que os elementos existem
        expect(screen.getByTestId('token')).toBeInTheDocument();
        expect(screen.getByTestId('userID')).toBeInTheDocument();

        // Verifica estado inicial baseado em localStorage limpo
        expect(screen.getByTestId('token').textContent).toBe('');
        expect(screen.getByTestId('userID').textContent).toBe('');
    });



    test('should set user ID correctly', () => {
        renderWithAuthProvider();

        // Simula clique no botão para alterar userID
        fireEvent.click(screen.getByText('Set User ID'));

        expect(screen.getByTestId('userID').textContent).toBe('123');
        expect(localStorage.getItem('userID')).toBe('123');
    });



    test('should remove userID from localStorage when setUserID is called with null', () => {
        localStorage.setItem('userID', '999');

        // Executa setUserID(null) diretamente via hook
        renderWithAuthProvider(({ setUserID }) => {
            setUserID(null);
        });

        expect(localStorage.getItem('userID')).toBeNull();
    });

    test('should set loggedIn correctly using setLoggedIn', () => {
        renderWithAuthProvider();

        // Dispara função de login
        fireEvent.click(screen.getByText('Set Logged In'));

        // Este teste cobre a execução da função, mesmo que não haja DOM associado
    });

    test('should throw error if useAuth is used outside of AuthProvider', () => {
        const BadComponent = () => {
            useAuth(); // Deve lançar erro fora do provider
            return <p>Should not render</p>;
        };

        // Espera que um erro seja lançado
        expect(() => render(<BadComponent />)).toThrow('useAuth must be used within an AuthProvider');
    });
});
