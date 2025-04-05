/**
 * Defines the structure for user notification preferences.
 */
export interface IUserNotificationPreferences {
    /**
     * Unique identifier for the user.
     */
    userId: string;

    /**
     * Whether the user wants to receive real-time notifications via Socket.IO.
     * Defaults to true if not specified.
     */
    receiveRealtime?: boolean;

    /**
     * Specific notification types the user wants to disable (e.g., 'system_update', 'new_message').
     * An empty array means all types are enabled.
     */
    disabledTypes?: string[];

    // Add other preference options as needed, e.g., email notifications, frequency limits, etc.
}