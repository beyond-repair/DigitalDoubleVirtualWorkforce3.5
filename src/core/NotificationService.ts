import { INotification } from '../interfaces/INotification';
import { IUserNotificationPreferences } from '../interfaces/IUserPreferences'; // Import preferences interface
import { Server as SocketIOServer } from 'socket.io';

export class NotificationService {
    private notifications: INotification[] = [];
    private io: SocketIOServer | null = null;
    // In-memory storage for user preferences (replace with persistent storage later)
    private userPreferences: Map<string, IUserNotificationPreferences> = new Map();

    constructor(io?: SocketIOServer) {
        if (io) {
            this.io = io;
            console.log("NotificationService initialized with Socket.IO server.");
        } else {
            console.log("NotificationService initialized without Socket.IO server.");
        }
        // Initialize with default preferences for a test user (example)
        this.setDefaultPreferences('user123');
    }

    // Set default preferences for a user if they don't exist
    private setDefaultPreferences(userId: string): void {
        if (!this.userPreferences.has(userId)) {
            this.userPreferences.set(userId, {
                userId: userId,
                receiveRealtime: true, // Default to receiving real-time notifications
                disabledTypes: [],
            });
        }
    }

    // Method to set user preferences
    public setUserPreferences(userId: string, preferences: Partial<IUserNotificationPreferences>): void {
        this.setDefaultPreferences(userId); // Ensure defaults exist
        const currentPrefs = this.userPreferences.get(userId)!;
        // Merge partial preferences with existing ones
        const updatedPrefs: IUserNotificationPreferences = {
            ...currentPrefs,
            ...preferences,
            userId: userId, // Ensure userId isn't overwritten
        };
        this.userPreferences.set(userId, updatedPrefs);
        console.log(`Preferences updated for user: ${userId}`, updatedPrefs);
    }

    // Method to get user preferences
    public getUserPreferences(userId: string): IUserNotificationPreferences | undefined {
        this.setDefaultPreferences(userId); // Ensure defaults exist before getting
        return this.userPreferences.get(userId);
    }

    // Create a new notification and emit event based on preferences
    public createNotification(message: string, userId: string, type = 'general'): INotification { // Removed redundant type, added optional type
        const notification: INotification = {
            id: this.generateId(),
            message,
            timestamp: new Date(),
            userId,
            read: false,
            type: type // Store the type
        };
        this.notifications.push(notification);

        // Check user preferences before emitting
        const prefs = this.getUserPreferences(userId);
        const shouldEmitRealtime = prefs?.receiveRealtime !== false; // Default to true
        const isTypeDisabled = prefs?.disabledTypes?.includes(type);

        if (this.io && shouldEmitRealtime && !isTypeDisabled) {
            console.log(`Emitting 'new_notification' (type: ${type}) to user room: ${userId}`);
            this.io.to(userId).emit('new_notification', notification);
        } else {
            if (!this.io) console.log("Socket.IO server not available, skipping emit.");
            if (!shouldEmitRealtime) console.log(`Real-time notifications disabled for user ${userId}, skipping emit.`);
            if (isTypeDisabled) console.log(`Notification type '${type}' disabled for user ${userId}, skipping emit.`);
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
            // Optionally, emit an update event if needed, respecting preferences
            // const prefs = this.getUserPreferences(notification.userId);
            // if (this.io && prefs?.receiveRealtime !== false && !prefs?.disabledTypes?.includes(notification.type)) {
            //     this.io.to(notification.userId).emit('notification_updated', notification);
            // }
        }
    }

    // Generate a unique ID for notifications
    private generateId(): string {
        return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    }

    // Method to update the io instance if needed later
    public setIoServer(io: SocketIOServer): void {
        this.io = io;
        console.log("Socket.IO server instance updated in NotificationService.");
    }
}
