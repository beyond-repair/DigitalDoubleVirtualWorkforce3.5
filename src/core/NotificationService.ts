import { INotification } from '../interfaces/INotification';
import { Server as SocketIOServer } from 'socket.io'; // Import Socket.IO Server type

export class NotificationService {
    private notifications: INotification[] = [];
    private io: SocketIOServer | null = null; // Property to hold the Socket.IO server instance

    // Constructor accepts the Socket.IO server instance
    constructor(io?: SocketIOServer) {
        if (io) {
            this.io = io;
            console.log("NotificationService initialized with Socket.IO server.");
        } else {
            console.log("NotificationService initialized without Socket.IO server.");
        }
    }

    // Create a new notification and emit an event
    public createNotification(message: string, userId: string): INotification {
        const notification: INotification = {
            id: this.generateId(),
            message,
            timestamp: new Date(),
            userId,
            read: false,
        };
        this.notifications.push(notification);

        // Emit event to the specific user's room if io is available
        if (this.io) {
            console.log(`Emitting 'new_notification' to user room: ${userId}`);
            this.io.to(userId).emit('new_notification', notification);
        } else {
            console.log("Socket.IO server not available, skipping emit.");
        }

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
            // Optionally, emit an update event
            // this.io?.to(notification.userId).emit('notification_updated', notification);
        }
    }

    // Generate a unique ID for notifications
    private generateId(): string {
        // Simple unique ID generator
        return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    }

    // Method to update the io instance if needed later
    public setIoServer(io: SocketIOServer): void {
        this.io = io;
        console.log("Socket.IO server instance updated in NotificationService.");
    }
}
