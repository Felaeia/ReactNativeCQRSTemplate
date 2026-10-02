import type { CreateTodoCommand, Todo } from './todo-schema';

export interface TodoRepository {
  getAll(): Promise<unknown>;
  create(command: CreateTodoCommand): Promise<unknown>;
  toggle(id: string): Promise<unknown>;
}

let todos: Todo[] = [];
let nextId = 1;

export const todoRepository: TodoRepository = {
  async getAll() {
    return todos.map((todo) => ({ ...todo }));
  },

  async create(command) {
    const todo: Todo = {
      id: `todo-${nextId++}`,
      title: command.title,
      completed: false,
    };
    todos = [...todos, todo];
    return { ...todo };
  },

  async toggle(id) {
    const existingTodo = todos.find((todo) => todo.id === id);
    if (!existingTodo) {
      throw new Error(`Todo not found: ${id}`);
    }

    const updatedTodo = { ...existingTodo, completed: !existingTodo.completed };
    todos = todos.map((todo) => (todo.id === id ? updatedTodo : todo));
    return { ...updatedTodo };
  },
};
