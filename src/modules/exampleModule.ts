/**
 * Example Module
 * This module provides functionality for managing tasks in the virtual workforce.
 */

export class TaskManager {
    private tasks: string[];

    /**
     * Initializes a new instance of the TaskManager class.
     */
    constructor() {
        this.tasks = [];
    }

    /**
     * Adds a new task to the task list.
     * @param task - The task to be added.
     */
    addTask(task: string): void {
        this.tasks.push(task);
    }

    /**
     * Retrieves all tasks.
     * @returns An array of tasks.
     */
    getTasks(): string[] {
        return this.tasks;
    }

    /**
     * Clears all tasks from the task list.
     */
    clearTasks(): void {
        this.tasks = [];
    }
}
