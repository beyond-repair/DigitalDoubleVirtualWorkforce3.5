import { ITask, TaskPriority, TaskStatus } from '../interfaces/ITask';

/**
 * Task Management Module
 * Provides functionality for creating, updating, assigning, and managing tasks in the virtual workforce.
 */

export class TaskManager {
    private tasks: ITask[];

    constructor() {
        this.tasks = [];
    }

    /**
     * Creates a new task and adds it to the task list.
     * @param data - The payload or data associated with the task.
     * @param priority - The priority of the task.
     * @returns The created task.
     */
    createTask(data: unknown, priority: TaskPriority = TaskPriority.MEDIUM): ITask {
        const newTask: ITask = {
            id: this.generateUniqueId(),
            priority,
            status: TaskStatus.PENDING,
            data,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.tasks.push(newTask);
        return newTask;
    }

    /**
     * Retrieves all tasks.
     * @returns An array of all tasks.
     */
    getTasks(): ITask[] {
        return this.tasks;
    }

    /**
     * Retrieves a task by its ID.
     * @param id - The ID of the task.
     * @returns The task if found, otherwise undefined.
     */
    getTaskById(id: string): ITask | undefined {
        return this.tasks.find(task => task.id === id);
    }

    /**
     * Retrieves tasks filtered by status.
     * @param status - The status to filter by.
     * @returns An array of tasks matching the status.
     */
    getTasksByStatus(status: TaskStatus): ITask[] {
        return this.tasks.filter(task => task.status === status);
    }

    /**
     * Updates the status of a task.
     * @param id - The ID of the task.
     * @param status - The new status.
     * @returns True if updated successfully, false if task not found.
     */
    updateTaskStatus(id: string, status: TaskStatus): boolean {
        const task = this.getTaskById(id);
        if (task) {
            task.status = status;
            task.updatedAt = new Date();
            return true;
        }
        return false;
    }

    /**
     * Assigns a task to an agent.
     * @param id - The ID of the task.
     * @param agentId - The ID of the agent.
     * @returns True if assigned successfully, false if task not found.
     */
    assignTask(id: string, agentId: string): boolean {
        const task = this.getTaskById(id);
        if (task) {
            task.assignedAgent = agentId;
            task.status = TaskStatus.ASSIGNED;
            task.updatedAt = new Date();
            return true;
        }
        return false;
    }

    /**
     * Removes a task by its ID.
     * @param id - The ID of the task to remove.
     * @returns True if removed successfully, false if task not found.
     */
    removeTask(id: string): boolean {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Clears all tasks from the task list.
     */
    clearTasks(): void {
        this.tasks = [];
    }

    /**
     * Generates a unique ID for a task.
     * @returns A unique string ID.
     */
    private generateUniqueId(): string {
        return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }
}
