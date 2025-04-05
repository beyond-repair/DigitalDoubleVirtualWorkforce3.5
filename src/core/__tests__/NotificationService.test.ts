import { NotificationService } from '../NotificationService';
import { INotification } from '../../interfaces/INotification';
import { IUserNotificationPreferences } from '../../interfaces/IUserPreferences'; // Import preferences interface
import { Server as SocketIOServer } from 'socket.io';

// Mock the Socket.IO Server and its methods
const mockEmit = jest.fn();
const mockTo = jest.fn(() => ({ emit: mockEmit }));
const mockIo = {
    to: mockTo,
    // Add other methods/properties if needed by the service
} as unknown as SocketIOServer;

describe('NotificationService', () => {
    let service: NotificationService;
    const testUserId = 'user123';

    beforeEach(() => {
        // Reset mocks before each test
        mockTo.mockClear();
        mockEmit.mockClear();
        // Initialize service with the mock Socket.IO server
        service = new NotificationService(mockIo);
        // Ensure default preferences are set for the test user
        service.setUserPreferences(testUserId, {}); // Set empty prefs to trigger default creation
    });

    test('should create a notification with default type and emit event', () => {
        const message = 'Test message general';
        const notification = service.createNotification(message, testUserId); // No type specified

        expect(notification).toHaveProperty('id');
        expect(notification.message).toBe(message);
        expect(notification.userId).toBe(testUserId);
        expect(notification.read).toBe(false);
        expect(notification.type).toBe('general'); // Check default type

        // Verify Socket.IO interactions
        expect(mockTo).toHaveBeenCalledWith(testUserId);
        expect(mockEmit).toHaveBeenCalledWith('new_notification', notification);
    });

    test('should create a notification with specific type and emit event', () => {
        const message = 'Test message specific type';
        const type = 'alert';
        const notification = service.createNotification(message, testUserId, type);

        expect(notification.type).toBe(type); // Check specific type
        expect(mockTo).toHaveBeenCalledWith(testUserId);
        expect(mockEmit).toHaveBeenCalledWith('new_notification', notification);
    });


    test('should retrieve notifications for a user', () => {
        const userId2 = 'user456';
        service.createNotification('Test message 1', testUserId);
        service.createNotification('Test message 2', userId2);
        mockTo.mockClear(); // Clear mocks after setup
        mockEmit.mockClear();

        const notifications = service.getNotifications(testUserId);
        expect(notifications.length).toBe(1);
        expect(notifications[0].message).toBe('Test message 1');
        expect(notifications[0].userId).toBe(testUserId);
        expect(mockEmit).not.toHaveBeenCalled();
    });

    test('should mark a notification as read', () => {
        const notification = service.createNotification('Test message', testUserId);
        mockTo.mockClear();
        mockEmit.mockClear();

        service.markAsRead(notification.id);
        const updatedNotifications = service.getNotifications(testUserId);
        const updatedNotification = updatedNotifications.find(n => n.id === notification.id);

        expect(updatedNotification).toBeDefined();
        expect(updatedNotification?.read).toBe(true);
        expect(mockEmit).not.toHaveBeenCalled();
    });

    test('should handle creation when Socket.IO server is not provided', () => {
        const serviceWithoutIo = new NotificationService(); // No io instance
        const message = 'Another message';
        const notification = serviceWithoutIo.createNotification(message, testUserId);

        expect(notification).toBeDefined();
        expect(notification.message).toBe(message);
        // Mocks associated with the 'service' instance should not be called
        expect(mockTo).not.toHaveBeenCalled();
        expect(mockEmit).not.toHaveBeenCalled();
    });

    // --- Tests for User Preferences ---

    test('should set and get user preferences', () => {
        const prefs: Partial<IUserNotificationPreferences> = {
            receiveRealtime: false,
            disabledTypes: ['system_update']
        };
        service.setUserPreferences(testUserId, prefs);

        const retrievedPrefs = service.getUserPreferences(testUserId);
        expect(retrievedPrefs).toBeDefined();
        expect(retrievedPrefs?.receiveRealtime).toBe(false);
        expect(retrievedPrefs?.disabledTypes).toEqual(['system_update']);
    });

    test('should use default preferences if none are set', () => {
        const newUser = 'newUser999';
        const prefs = service.getUserPreferences(newUser); // Get prefs for a user without explicitly set ones
        expect(prefs).toBeDefined();
        expect(prefs?.receiveRealtime).toBe(true); // Default
        expect(prefs?.disabledTypes).toEqual([]); // Default
    });

    test('should NOT emit real-time notification if receiveRealtime is false', () => {
        service.setUserPreferences(testUserId, { receiveRealtime: false });
        mockTo.mockClear();
        mockEmit.mockClear();

        service.createNotification('Realtime disabled message', testUserId);

        expect(mockTo).not.toHaveBeenCalled();
        expect(mockEmit).not.toHaveBeenCalled();
    });

    test('should NOT emit real-time notification if type is disabled', () => {
        const disabledType = 'marketing';
        service.setUserPreferences(testUserId, { disabledTypes: [disabledType] });
        mockTo.mockClear();
        mockEmit.mockClear();

        service.createNotification('Marketing message', testUserId, disabledType);

        expect(mockTo).not.toHaveBeenCalled();
        expect(mockEmit).not.toHaveBeenCalled();
    });

     test('should emit real-time notification if type is NOT disabled', () => {
        const disabledType = 'marketing';
        const enabledType = 'alert';
        service.setUserPreferences(testUserId, { disabledTypes: [disabledType] });
        mockTo.mockClear();
        mockEmit.mockClear();

        const notification = service.createNotification('Alert message', testUserId, enabledType);

        expect(mockTo).toHaveBeenCalledWith(testUserId);
        expect(mockEmit).toHaveBeenCalledWith('new_notification', notification);
    });

});