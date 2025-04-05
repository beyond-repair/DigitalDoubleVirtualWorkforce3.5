export interface INotification {
    id: string;
    message: string;
    timestamp: Date;
    userId: string;
    type?: string; // Optional type for categorization (e.g., 'system', 'message')
    read: boolean;
}
