import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTodoHandler,
  getTodosHandler,
  toggleTodoHandler,
} from './handlers';
import { todoRepository } from './todo-repository';

export const todoQueryKeys = {
  all: ['todos'] as const,
};

export function useTodos() {
  return useQuery({
    queryKey: todoQueryKeys.all,
    queryFn: () => getTodosHandler(todoRepository),
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: unknown) => createTodoHandler(input, todoRepository),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todoQueryKeys.all }),
  });
}

export function useToggleTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: unknown) => toggleTodoHandler(input, todoRepository),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todoQueryKeys.all }),
  });
}
