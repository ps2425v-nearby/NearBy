/**
 * Tipos válidos para o tipo da notificação.
 */
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

/**
 * Estado da notificação.
 */
export type NotificationState = {
    show: boolean;         /** Se a notificação está visível */
    message: string;       /** Mensagem da notificação */
    type: NotificationType;/** Tipo da notificação */
    duration: number;      /** Duração em milissegundos */
};

/** Duração padrão das notificações (3 segundos) */
export const DEFAULT_NOTIFICATION_DURATION = 3000;

/** Estado inicial da notificação */
export const initialNotificationState: NotificationState = {
    show: false,
    message: '',
    type: 'info',
    duration: DEFAULT_NOTIFICATION_DURATION,
};
