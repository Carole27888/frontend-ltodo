'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Todo, CreateTodoData, UpdateTodoData } from '@/app/types';
import { API_ENDPOINTS, api } from '@/config/api';

export function useTodos() {
  const queryClient = useQueryClient();

  // Fetch all todos
  const {
    data: todos = [],
    isLoading: loading,
    error,
  } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.TODOS.GET_ALL);
      return response.data.todos || response.data;
    },
  });

  // Create a new todo
  const createTodo = async (data: CreateTodoData) => {
    try {
      await api.post(API_ENDPOINTS.TODOS.CREATE, data);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.message || 'Failed to create todo',
      };
    }
  };

  // Update an existing todo
  const updateTodo = async (id: string, updates: UpdateTodoData) => {
    try {
      await api.put(API_ENDPOINTS.TODOS.UPDATE(id), updates);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.message || 'Failed to update todo',
      };
    }
  };

  // Delete a todo
  const deleteTodo = async (id: string) => {
    try {
      await api.delete(API_ENDPOINTS.TODOS.DELETE(id));
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.message || 'Failed to delete todo',
      };
    }
  };

  // Toggle completion status
  const toggleComplete = async (id: string, isCompleted: boolean) => {
    try {
      await api.patch(`${API_ENDPOINTS.TODOS.GET_BY_ID(id)}/complete`, { isCompleted });

      queryClient.invalidateQueries({ queryKey: ['todos'] });
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.message || 'Failed to update status',
      };
    }
  };

  return {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  };
}
