import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Dialog, 
  TextField, 
  Select, 
  MenuItem,
  FormControl,
  InputLabel 
} from '@mui/material';
import { ITask } from '../../core/interfaces/agent.interface';

interface TaskManagerProps {
  onSubmit: (task: ITask) => Promise<void>;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState<Partial<ITask>>({
    type: '',
    priority: 1,
    payload: {}
  });

  const handleSubmit = async (): Promise<void> => {
    if (task.type) {
      await onSubmit({
        id: `task-${Date.now()}`,
        type: task.type,
        priority: task.priority || 1,
        payload: task.payload || {}
      });
      setOpen(false);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Create Task
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box p={3}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Task Type"
              value={task.type}
              onChange={(e) => setTask({ ...task, type: e.target.value })}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              value={task.priority}
              onChange={(e) => setTask({ ...task, priority: Number(e.target.value) })}
            >
              {[1, 2, 3, 4, 5].map(p => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={handleSubmit} variant="contained" fullWidth>
            Submit
          </Button>
        </Box>
      </Dialog>
    </>
  );
};
