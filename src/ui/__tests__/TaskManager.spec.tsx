import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskManager } from '../components/TaskManager';

describe('TaskManager', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should create a task with correct properties', async () => {
    render(<TaskManager onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByText('Create Task'));
    fireEvent.change(screen.getByLabelText('Task Type'), {
      target: { value: 'test-task' }
    });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        type: 'test-task',
        priority: 1
      }));
    });
  });
});
