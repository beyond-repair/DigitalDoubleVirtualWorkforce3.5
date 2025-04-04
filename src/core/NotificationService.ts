import { INotification } from '../interfaces/INotification';

export class NotificationService {
    private notifications: INotification[] = [];

    // Create a new notification
    public createNotification(message: string, userId: string): INotification {
        const notification: INotification = {
            id: this.generateId(),
            message,
            timestamp: new Date(),
            userId,
            read: false,
        };
        this.notifications.push(notification);
        return notification;
    }

    // Retrieve all notifications for a user
    public getNotifications(userId: string): INotification[] {
        return this.notifications.filter(notification => notification.userId === userId);
    }

    // Mark a notification as read
    public markAsRead(notificationId: string): void {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
        }
    }

    // Generate a unique ID for notifications
    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}
