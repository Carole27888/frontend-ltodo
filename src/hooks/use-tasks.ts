'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Task, CreateTaskData, UpdateTaskData } from '@/app/types';
import { API_ENDPOINTS, api } from '@/config/api';

export function useTasks() {
  const queryClient = useQueryClient();

  // Fetch all tasks
  const { data: tasks = [], isLoading: loading, error } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.TASKS.GET_ALL);
      return response.data.tasks || response.data;
    },
  });

  // Create a task
  const createTask = async (data: CreateTaskData) => {
    try {
      await api.post(API_ENDPOINTS.TASKS.CREATE, data);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to create task',
      };
    }
  };

  // Update a task
  const updateTask = async (id: string, updates: UpdateTaskData) => {
    try {
      await api.put(API_ENDPOINTS.TASKS.UPDATE(id), updates);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to update task',
      };
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    try {
      await api.delete(API_ENDPOINTS.TASKS.DELETE(id));
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to delete task',
      };
    }
  };

  // Toggle completion
  const toggleComplete = async (id: string, isCompleted: boolean) => {
    try {
      await api.put(API_ENDPOINTS.TASKS.UPDATE(id), { isCompleted });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to update status',
      };
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  };
}
