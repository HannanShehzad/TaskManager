import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useSnackbarContext } from '../context/SnackbarContext';
import taskService from '../services/taskService';

export const useTasks = () => {
  const { token } = useAuth();
  const { openSnackBar } = useSnackbarContext();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await taskService.getAllTasks(token);
      return response.data.tasks || [];
    },
    onError: (error) => {
      console.error('Error fetching tasks:', error);
      openSnackBar(
        'error',
        error.response?.data?.message || 'Failed to fetch tasks'
      );
    },
  });

  const createTask = useMutation({
    mutationFn: (taskData) => taskService.createTask(taskData, token),
    onSuccess: (response) => {
      queryClient.setQueryData(['tasks'], (old = []) => [...old, response.data.task]);
      openSnackBar('success', 'Task created successfully');
    },
    onError: (error) => {
      openSnackBar('error', error.response?.data?.message || 'Failed to create task');
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ taskId, taskData }) => taskService.updateTask(taskId, taskData, token),
    onSuccess: (response, { taskId, taskData }) => {
      queryClient.setQueryData(['tasks'], (old = []) =>
        old.map((task) =>
          task._id === taskId ? { ...task, ...taskData } : task
        )
      );
      openSnackBar('success', 'Task updated successfully');
    },
    onError: (error) => {
      openSnackBar('error', error.response?.data?.message || 'Failed to update task');
    },
  });

  const deleteTask = useMutation({
    mutationFn: (taskId) => taskService.deleteTask(taskId, token),
    onSuccess: (_, taskId) => {
      queryClient.setQueryData(['tasks'], (old = []) =>
        old.filter((task) => task._id !== taskId)
      );
      openSnackBar('success', 'Task deleted successfully');
    },
    onError: (error) => {
      openSnackBar('error', error.response?.data?.message || 'Failed to delete task');
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask: createTask.mutate,
    updateTask: updateTask.mutate,
    deleteTask: deleteTask.mutate,
  };
};