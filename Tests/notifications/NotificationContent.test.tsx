import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NotificationProvider, useNotification } from '../../src/context/Notifications/NotificationsContext';
import { notificationReducer } from '../../src/context/Notifications/NotificationReducer';
import { NotificationState } from '../../src/context/Notifications/NotificationTypes';


// Componente de teste interno para usar o contexto
const TestComponent = () => {
    const { notification, showNotification, hideNotification } = useNotification();

    return (
        <div>
            <button onClick={() => showNotification('Hello', 'success', 100)}>Show</button>
            <button onClick={hideNotification}>Hide</button>
            {notification.show && <span>{notification.message}</span>}
        </div>
    );
};

describe('NotificationContext', () => {
    it('throws error when used outside of provider', () => {
        // Criar componente sem provider para forçar erro
        const BrokenComponent = () => {
            useNotification();
            return null;
        };

        // Espera erro
        expect(() => render(<BrokenComponent />)).toThrow(
            'useNotification must be used within a NotificationProvider'
        );
    });

        it('returns current state for unknown action', () => {
            const initialState = {
                show: false,
                message: '',
                type: 'info',
                duration: 3000,
            };

            // @ts-expect-error: testing invalid action
            const nextState = notificationReducer(initialState, { type: 'UNKNOWN_ACTION' });

            expect(nextState).toEqual(initialState);
        });

        it('should return current state for unknown action type', () => {
            const initialState: NotificationState = {
                show: false,
                message: '',
                type: 'info',
                duration: 3000,
            };

            // @ts-expect-error: deliberately using an unknown action
            const result = notificationReducer(initialState, { type: 'UNKNOWN_ACTION' });

            expect(result).toEqual(initialState);
        });


    it('shows and hides notification correctly', () => {
        jest.useFakeTimers(); // usar timers falsos

        render(
            <NotificationProvider>
                <TestComponent />
            </NotificationProvider>
        );

        const showButton = screen.getByText('Show');
        const hideButton = screen.getByText('Hide');

        // Mostrar notificação
        act(() => {
            showButton.click();
        });

        expect(screen.getByText('Hello')).toBeInTheDocument();

        // Tempo passa para auto-hide
        act(() => {
            jest.advanceTimersByTime(100);
        });

        // A notificação deve desaparecer
        expect(screen.queryByText('Hello')).not.toBeInTheDocument();

        // Mostrar novamente para testar botão de "Hide"
        act(() => {
            showButton.click();
        });
        expect(screen.getByText('Hello')).toBeInTheDocument();

        // Esconder manualmente
        act(() => {
            hideButton.click();
        });

        expect(screen.queryByText('Hello')).not.toBeInTheDocument();

        jest.useRealTimers(); // restaurar timers reais
    });
});


