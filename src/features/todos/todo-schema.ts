import { z } from 'zod';

export const TodoSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    completed: z.boolean(),
  })
  .strict();

export const TodosSchema = z.array(TodoSchema);

export const CreateTodoCommandSchema = z
  .object({
    title: z.string().trim().min(1, 'Enter a todo title.').max(120),
  })
  .strict();

export const ToggleTodoCommandSchema = z
  .object({
    id: z.string().min(1),
  })
  .strict();

export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodoCommand = z.infer<typeof CreateTodoCommandSchema>;
export type ToggleTodoCommand = z.infer<typeof ToggleTodoCommandSchema>;
