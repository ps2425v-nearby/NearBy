export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export type NotificationState = {
    show: boolean;
    message: string;
    type: NotificationType;
    duration: number;
};

export const DEFAULT_NOTIFICATION_DURATION = 3000;

export const initialNotificationState: NotificationState = {
    show: false,
    message: '',
    type: 'info',
    duration: DEFAULT_NOTIFICATION_DURATION,
};
