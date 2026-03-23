import { z } from "zod";

export const todoSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  todo: z.string().min(1, "todo is required"),
  completed: z.boolean().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  tags: z.array(z.string()).optional(),
});

export const updateTodoSchema = todoSchema.partial();

export const bulkUpdateSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one todo ID is required"),
  updates: updateTodoSchema,
});

export const bulkDeleteSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one todo ID is required"),
});
