export enum NotificationPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

export enum NotificationChannel {
    EMAIL = 'EMAIL',
    SMS = 'SMS',
    WEBHOOK = 'WEBHOOK',
    WEBSOCKET = 'WEBSOCKET'
}

export interface INotification {
    id: string;
    title: string;
    message: string;
    priority: NotificationPriority;
    channels: NotificationChannel[];
    metadata?: Record<string, unknown>;
    createdAt: Date;
    deliveredAt?: Date;
}
