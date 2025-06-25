import { NotificationState, NotificationType, DEFAULT_NOTIFICATION_DURATION } from './NotificationTypes';

export type NotificationAction =
    | { type: 'SHOW_NOTIFICATION'; payload: { message: string; type: NotificationType; duration?: number } }
    | { type: 'HIDE_NOTIFICATION' };

export function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
    switch (action.type) {
        case 'SHOW_NOTIFICATION':
            return {
                ...state,
                show: true,
                message: action.payload.message,
                type: action.payload.type,
                duration: action.payload.duration ?? DEFAULT_NOTIFICATION_DURATION,
            };
        case 'HIDE_NOTIFICATION':
            return {
                ...state,
                show: false,
            };
        default:
            return state;
    }
}
