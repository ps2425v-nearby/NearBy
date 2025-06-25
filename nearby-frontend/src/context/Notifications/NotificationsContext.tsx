import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
    NotificationState,
    NotificationType,
    initialNotificationState,
} from './NotificationTypes';
import { notificationReducer, NotificationAction } from './NotificationReducer';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

type NotificationContextType = {
    notification: NotificationState;
    showNotification: (message: string, type: NotificationType, duration?: number) => void;
    hideNotification: () => void;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notification, dispatch] = useReducer<React.Reducer<NotificationState, NotificationAction>>(
        notificationReducer,
        initialNotificationState
    );

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (notification.show) {
            timer = setTimeout(() => {
                dispatch({ type: 'HIDE_NOTIFICATION' });
            }, notification.duration);
        }

        return () => clearTimeout(timer);
    }, [notification.show, notification.duration]);

    const showNotification = (message: string, type: NotificationType, duration?: number) => {


        dispatch({
            type: 'SHOW_NOTIFICATION',
            payload: { message, type, duration },
        });
    };

    const hideNotification = () => {
        dispatch({ type: 'HIDE_NOTIFICATION' });
    };

    const value: NotificationContextType = {
        notification,
        showNotification,
        hideNotification,
    };

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
