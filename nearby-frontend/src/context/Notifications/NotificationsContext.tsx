import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
    NotificationState,
    NotificationType,
    initialNotificationState,
} from './NotificationTypes';
import { notificationReducer, NotificationAction } from './NotificationReducer';

/**
 * Tipo do contexto de notificações, contendo estado atual e funções para mostrar/ocultar notificações.
 */
type NotificationContextType = {
    notification: NotificationState;
    showNotification: (message: string, type: NotificationType, duration?: number) => void;
    hideNotification: () => void;
};

/**
 * Criação do contexto de notificações.
 */
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * Provider que encapsula a lógica das notificações e disponibiliza o contexto para os componentes filhos.
 * @param children Componentes filhos que terão acesso ao contexto
 */
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    /**
     * useReducer para gerenciar o estado da notificação usando o reducer definido.
     */
    const [notification, dispatch] = useReducer<React.Reducer<NotificationState, NotificationAction>>(
        notificationReducer,
        initialNotificationState
    );

    /**
     * useEffect para esconder a notificação automaticamente após o tempo de duração definido.
     */
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (notification.show) {
            timer = setTimeout(() => {
                dispatch({ type: 'HIDE_NOTIFICATION' });
            }, notification.duration);
        }

        return () => clearTimeout(timer); // Limpa o timer quando a notificação muda ou componente desmonta
    }, [notification.show, notification.duration]);

    /**
     * Função para mostrar a notificação.
     * @param message Mensagem a ser exibida
     * @param type Tipo da notificação ('success', 'error', etc)
     * @param duration (Opcional) duração da notificação em ms
     */
    const showNotification = (message: string, type: NotificationType, duration?: number) => {
        dispatch({
            type: 'SHOW_NOTIFICATION',
            payload: { message, type, duration },
        });
    };

    /**
     * Função para esconder a notificação.
     */
    const hideNotification = () => {
        dispatch({ type: 'HIDE_NOTIFICATION' });
    };

    /** Valor passado pelo contexto com estado e funções. */
    const value: NotificationContextType = {
        notification,
        showNotification,
        hideNotification,
    };

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

/**
 * Hook personalizado para consumir o contexto de notificações.
 * @throws Erro se usado fora do provider.
 */
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
