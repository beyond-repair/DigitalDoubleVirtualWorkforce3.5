import { TaskManager } from '../../src/modules/exampleModule';
import { TaskPriority, TaskStatus, ITask } from '../../src/interfaces/ITask';

describe('TaskManager', () => {
    let manager: TaskManager;

    beforeEach(() => {
        manager = new TaskManager();
    });

    it('should create a new task with default priority', () => {
        const task = manager.createTask({ foo: 'bar' });
        expect(task).toHaveProperty('id');
        expect(task.priority).toBe(TaskPriority.MEDIUM);
        expect(task.status).toBe(TaskStatus.PENDING);
        expect(task.data).toEqual({ foo: 'bar' });
        expect(manager.getTasks().length).toBe(1);
    });

    it('should create a new task with specified priority', () => {
        const task = manager.createTask({ foo: 'bar' }, TaskPriority.CRITICAL);
        expect(task.priority).toBe(TaskPriority.CRITICAL);
    });

    it('should retrieve a task by ID', () => {
        const task = manager.createTask({ foo: 'bar' });
        const fetched = manager.getTaskById(task.id);
        expect(fetched).toEqual(task);
    });

    it('should return undefined for non-existent task ID', () => {
        expect(manager.getTaskById('nonexistent')).toBeUndefined();
    });

    it('should retrieve tasks by status', () => {
        const t1 = manager.createTask({}, TaskPriority.LOW);
        const t2 = manager.createTask({}, TaskPriority.HIGH);
        manager.updateTaskStatus(t2.id, TaskStatus.RUNNING);
        const pendingTasks = manager.getTasksByStatus(TaskStatus.PENDING);
        const runningTasks = manager.getTasksByStatus(TaskStatus.RUNNING);
        expect(pendingTasks).toContainEqual(t1);
        expect(pendingTasks).not.toContainEqual(t2);
        expect(runningTasks).toContainEqual(t2);
    });

    it('should update task status', () => {
        const task = manager.createTask({});
        const updated = manager.updateTaskStatus(task.id, TaskStatus.COMPLETED);
        expect(updated).toBe(true);
        const fetched = manager.getTaskById(task.id);
        expect(fetched?.status).toBe(TaskStatus.COMPLETED);
    });

    it('should return false when updating status of non-existent task', () => {
        expect(manager.updateTaskStatus('nonexistent', TaskStatus.COMPLETED)).toBe(false);
    });

    it('should assign a task to an agent', () => {
        const task = manager.createTask({});
        const assigned = manager.assignTask(task.id, 'agent-123');
        expect(assigned).toBe(true);
        const fetched = manager.getTaskById(task.id);
        expect(fetched?.assignedAgent).toBe('agent-123');
        expect(fetched?.status).toBe(TaskStatus.ASSIGNED);
    });

    it('should return false when assigning non-existent task', () => {
        expect(manager.assignTask('nonexistent', 'agent-123')).toBe(false);
    });

    it('should remove a task by ID', () => {
        const task = manager.createTask({});
        const removed = manager.removeTask(task.id);
        expect(removed).toBe(true);
        expect(manager.getTaskById(task.id)).toBeUndefined();
    });

    it('should return false when removing non-existent task', () => {
        expect(manager.removeTask('nonexistent')).toBe(false);
    });

    it('should clear all tasks', () => {
        manager.createTask({});
        manager.createTask({});
        expect(manager.getTasks().length).toBe(2);
        manager.clearTasks();
        expect(manager.getTasks().length).toBe(0);
    });
});