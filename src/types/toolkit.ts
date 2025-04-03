export interface ToolkitConfig {
    name: string;
    version: string;
    timeout: number;
    retryAttempts: number;
}

export interface ToolkitResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: Error;
    metrics: {
        duration: number;
        retries: number;
    };
}

export interface Toolkit {
    readonly config: ToolkitConfig;
    initialize(): Promise<void>;
    execute<T>(action: string, params: unknown): Promise<ToolkitResponse<T>>;
    healthCheck(): Promise<boolean>;
}
