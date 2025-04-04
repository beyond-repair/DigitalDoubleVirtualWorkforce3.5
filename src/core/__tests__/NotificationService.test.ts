import { NotificationService } from '../NotificationService';
import { INotification } from '../../interfaces/INotification';
import { Server as SocketIOServer } from 'socket.io'; // Import Socket.IO Server type

// Mock the Socket.IO Server and its methods
const mockEmit = jest.fn();
const mockTo = jest.fn(() => ({ emit: mockEmit }));
const mockIo = {
    to: mockTo,
    // Add other methods/properties if needed by the service
} as unknown as SocketIOServer; // Cast to SocketIOServer type

describe('NotificationService', () => {
    let service: NotificationService;

    beforeEach(() => {
        // Reset mocks before each test
        mockTo.mockClear();
        mockEmit.mockClear();
        // Initialize service with the mock Socket.IO server
        service = new NotificationService(mockIo);
    });

    test('should create a notification and emit event via Socket.IO', () => {
        const userId = 'user123';
        const message = 'Test message';
        const notification = service.createNotification(message, userId);

        expect(notification).toHaveProperty('id');
        expect(notification.message).toBe(message);
        expect(notification.userId).toBe(userId);
        expect(notification.read).toBe(false);

        // Verify Socket.IO interactions
        expect(mockTo).toHaveBeenCalledWith(userId); // Check if .to(userId) was called
        expect(mockEmit).toHaveBeenCalledWith('new_notification', notification); // Check if emit was called with correct event and data
    });

    test('should retrieve notifications for a user', () => {
        const userId1 = 'user123';
        const userId2 = 'user456';
        service.createNotification('Test message 1', userId1);
        service.createNotification('Test message 2', userId2);

        // Clear mocks from the createNotification calls in this test
        mockTo.mockClear();
        mockEmit.mockClear();

        const notifications = service.getNotifications(userId1);
        expect(notifications.length).toBe(1);
        expect(notifications[0].message).toBe('Test message 1');
        expect(notifications[0].userId).toBe(userId1);

        // Ensure no emit happened during getNotifications
        expect(mockEmit).not.toHaveBeenCalled();
    });

    test('should mark a notification as read', () => {
        const userId = 'user123';
        const notification = service.createNotification('Test message', userId);

        // Clear mocks from createNotification
        mockTo.mockClear();
        mockEmit.mockClear();

        service.markAsRead(notification.id);
        const updatedNotifications = service.getNotifications(userId);
        const updatedNotification = updatedNotifications.find(n => n.id === notification.id);

        expect(updatedNotification).toBeDefined();
        expect(updatedNotification?.read).toBe(true);

        // Ensure no emit happened during markAsRead (unless implemented later)
        expect(mockEmit).not.toHaveBeenCalled();
    });

    test('should handle creation when Socket.IO server is not provided', () => {
        // Initialize service without io server
        const serviceWithoutIo = new NotificationService();
        const userId = 'user789';
        const message = 'Another message';
        const notification = serviceWithoutIo.createNotification(message, userId);

        expect(notification).toBeDefined();
        expect(notification.message).toBe(message);
        // Ensure mocks were not called as io was not provided
        expect(mockTo).not.toHaveBeenCalled();
        expect(mockEmit).not.toHaveBeenCalled();
    });
});