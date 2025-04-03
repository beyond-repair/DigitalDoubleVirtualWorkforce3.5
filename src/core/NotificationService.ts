import { INotification, NotificationChannel } from '../interfaces/INotification';
import WebSocket from 'ws';

export class NotificationService {
    private wsClients: Map<string, WebSocket> = new Map();
    private notifications: INotification[] = [];

    public async sendNotification(notification: Omit<INotification, 'id' | 'createdAt'>): Promise<INotification> {
        const newNotification: INotification = {
            ...notification,
            id: crypto.randomUUID(),
            createdAt: new Date()
        };

        for (const channel of notification.channels) {
            await this.deliverToChannel(newNotification, channel);
        }

        this.notifications.push(newNotification);
        return newNotification;
    }

    private async deliverToChannel(notification: INotification, channel: NotificationChannel): Promise<void> {
        switch (channel) {
            case NotificationChannel.WEBSOCKET:
                this.broadcastToWebSocket(notification);
                break;
            // Implement other channels
        }
    }

    private broadcastToWebSocket(notification: INotification): void {
        const message = JSON.stringify(notification);
        this.wsClients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
}
