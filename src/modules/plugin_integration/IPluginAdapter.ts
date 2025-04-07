/**
 * IPluginAdapter
 *
 * Common interface for all plugin adapters (Docker, Git, CI/CD, API, etc.)
 * Enforces lifecycle management, error handling, and consistent integration.
 */

export interface IPluginAdapter {
    /**
     * Initialize the plugin adapter (e.g., authenticate, set up clients).
     */
    initialize(): Promise<void>;

    /**
     * Perform a health check to verify the plugin is operational.
     * @returns true if healthy, false otherwise
     */
    healthCheck(): Promise<boolean>;

    /**
     * Shutdown or cleanup resources.
     */
    shutdown(): Promise<void>;

    /**
     * Optional: Get plugin metadata or status.
     */
    getStatus?(): Promise<unknown>;
}