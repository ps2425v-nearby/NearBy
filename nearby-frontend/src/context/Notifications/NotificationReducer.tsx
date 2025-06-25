import { NotificationState, NotificationType, DEFAULT_NOTIFICATION_DURATION } from './NotificationTypes';

/**
 * Tipos de ações que podem ser despachadas para o reducer de notificações.
 */
export type NotificationAction =
    | { type: 'SHOW_NOTIFICATION'; payload: { message: string; type: NotificationType; duration?: number } }
    | { type: 'HIDE_NOTIFICATION' };

/**
 * Reducer para atualizar o estado da notificação com base na ação recebida.
 * @param state Estado atual da notificação
 * @param action Ação que altera o estado
 * @returns Novo estado da notificação
 */
export function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
    switch (action.type) {
        case 'SHOW_NOTIFICATION':
            return {
                ...state,
                show: true,
                message: action.payload.message,
                type: action.payload.type,
                duration: action.payload.duration ?? DEFAULT_NOTIFICATION_DURATION, // Usa duração padrão se não for passada
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
