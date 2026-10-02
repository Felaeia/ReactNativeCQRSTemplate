import {
  createTodoHandler,
  getTodosHandler,
  toggleTodoHandler,
} from '../handlers';
import type { TodoRepository } from '../todo-repository';

describe('todo handlers', () => {
  const todo = { id: 'todo-1', title: 'Write tests', completed: false };

  it('validates command input before creating a todo', async () => {
    const repository: TodoRepository = {
      getAll: jest.fn(),
      create: jest.fn().mockResolvedValue(todo),
      toggle: jest.fn(),
    };

    await expect(createTodoHandler({ title: '  Write tests  ' }, repository)).resolves.toEqual(
      todo,
    );
    expect(repository.create).toHaveBeenCalledWith({ title: 'Write tests' });

    await expect(createTodoHandler({ title: '   ' }, repository)).rejects.toThrow();
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it('validates query results returned by the repository', async () => {
    const repository: TodoRepository = {
      getAll: jest.fn().mockResolvedValue([todo]),
      create: jest.fn(),
      toggle: jest.fn(),
    };

    await expect(getTodosHandler(repository)).resolves.toEqual([todo]);

    repository.getAll = jest.fn().mockResolvedValue([{ id: 1, title: 'Invalid', completed: false }]);
    await expect(getTodosHandler(repository)).rejects.toThrow();
  });

  it('validates toggle commands and parses the updated todo', async () => {
    const repository: TodoRepository = {
      getAll: jest.fn(),
      create: jest.fn(),
      toggle: jest.fn().mockResolvedValue({ ...todo, completed: true }),
    };

    await expect(toggleTodoHandler({ id: 'todo-1' }, repository)).resolves.toEqual({
      ...todo,
      completed: true,
    });
    expect(repository.toggle).toHaveBeenCalledWith('todo-1');

    await expect(toggleTodoHandler({ id: '' }, repository)).rejects.toThrow();
  });
});
