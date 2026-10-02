import {
  CreateTodoCommandSchema,
  TodoSchema,
  TodosSchema,
  ToggleTodoCommandSchema,
  type Todo,
} from './todo-schema';
import type { TodoRepository } from './todo-repository';

export async function getTodosHandler(repository: TodoRepository): Promise<Todo[]> {
  return TodosSchema.parse(await repository.getAll());
}

export async function createTodoHandler(
  input: unknown,
  repository: TodoRepository,
): Promise<Todo> {
  const command = CreateTodoCommandSchema.parse(input);
  return TodoSchema.parse(await repository.create(command));
}

export async function toggleTodoHandler(
  input: unknown,
  repository: TodoRepository,
): Promise<Todo> {
  const command = ToggleTodoCommandSchema.parse(input);
  return TodoSchema.parse(await repository.toggle(command.id));
}
