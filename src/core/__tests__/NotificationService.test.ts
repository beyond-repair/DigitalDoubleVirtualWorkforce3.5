import { NotificationService } from '../NotificationService';
import { INotification } from '../../interfaces/INotification';

describe('NotificationService', () => {
    let service: NotificationService;

    beforeEach(() => {
        service = new NotificationService();
    });

    test('should create a notification', () => {
        const notification = service.createNotification('Test message', 'user123');
        expect(notification).toHaveProperty('id');
        expect(notification.message).toBe('Test message');
        expect(notification.userId).toBe('user123');
        expect(notification.read).toBe(false);
    });

    test('should retrieve notifications for a user', () => {
        service.createNotification('Test message 1', 'user123');
        service.createNotification('Test message 2', 'user456');
        const notifications = service.getNotifications('user123');
        expect(notifications.length).toBe(1);
        expect(notifications[0].message).toBe('Test message 1');
    });

    test('should mark a notification as read', () => {
        const notification = service.createNotification('Test message', 'user123');
        service.markAsRead(notification.id);
        expect(notification.read).toBe(true);
    });
});