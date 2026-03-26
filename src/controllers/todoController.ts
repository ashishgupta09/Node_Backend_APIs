import { Request, Response } from "express";
import { prisma } from "../config/db";
import { todoSchema, updateTodoSchema, bulkUpdateSchema, bulkDeleteSchema } from "../utils/todoValidation";

// Create Todo
export const createTodo = async (req: Request, res: Response) => {
    try {
        const validatedData = todoSchema.parse(req.body);
        const newTodo = await prisma.todo.create({
            data: {
                userId: validatedData.userId,
                todo: validatedData.todo,
                completed: validatedData.completed || false,
                dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
                priority: validatedData.priority || "medium",
                tags: validatedData.tags || []
            }
        });
        res.status(201).json(newTodo);
    } catch (error: any) {
        res.status(400).json({ error: error.errors || error.message });
    }
};

// Get All Todos for a User (with Pagination, Sorting, and Filtering)
export const getTodosByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { 
            page = 1, 
            limit = 10, 
            sortBy = "createdAt", 
            order = "desc", 
            completed,
            priority,
            search
        } = req.query;

        const where: any = { userId: String(userId) };

        // Filtering
        if (completed !== undefined) {
            where.completed = completed === "true";
        }
        if (priority) {
            where.priority = priority as any;
        }
        if (search) {
            where.todo = {
                contains: String(search),
                mode: 'insensitive'
            };
        }

        // Pagination calculations
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const [todos, total] = await Promise.all([
            prisma.todo.findMany({
                where,
                orderBy: { [String(sortBy)]: order as any },
                skip,
                take
            }),
            prisma.todo.count({ where })
        ]);

        res.status(200).json({
            todos,
            total,
            page: Number(page),
            pages: Math.ceil(total / take)
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get Todo by ID
export const getTodoById = async (req: Request, res: Response) => {
    try {
        const id  = String(req.params.id);
        const todo = await prisma.todo.findUnique({ where: { id } });
        if (!todo) {
            res.status(404).json({ message: "Todo not found" });
            return;
        }
        res.status(200).json(todo);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Update Todo
export const updateTodo = async (req: Request, res: Response) => {
    try {
        const id  = String(req.params.id);
        const validatedData = updateTodoSchema.parse(req.body);
        
        const todo = await prisma.todo.update({
            where: { id },
            data: {
                ...validatedData,
                dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined
            }
        });
        
        res.status(200).json(todo);
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "Todo not found" });
        } else {
            res.status(400).json({ error: error.errors || error.message });
        }
    }
};

// Delete Todo
export const deleteTodo = async (req: Request, res: Response) => {
    try {
        const id  = String(req.params.id);
        await prisma.todo.delete({ where: { id } });
        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "Todo not found" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

// Bulk Update (General)
export const bulkUpdateTodos = async (req: Request, res: Response) => {
    try {
        const { ids, updates } = bulkUpdateSchema.parse(req.body);
        const result = await prisma.todo.updateMany({
            where: { id: { in: ids } },
            data: updates
        });
        res.status(200).json({ 
            message: "Bulk update successful", 
            modifiedCount: result.count 
        });
    } catch (error: any) {
        res.status(400).json({ error: error.errors || error.message });
    }
};

// Clear Completed Todos for a User
export const clearCompletedTodos = async (req: Request, res: Response) => {
    try {
        const userId  = String(req.params.userId);
        const result = await prisma.todo.deleteMany({
            where: { userId, completed: true }
        });
        res.status(200).json({ 
            message: "Cleared completed todos successfully", 
            deletedCount: result.count 
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Bulk Delete Todos
export const bulkDeleteTodos = async (req: Request, res: Response) => {
    try {
        const { ids } = bulkDeleteSchema.parse(req.body);
        const result = await prisma.todo.deleteMany({
            where: { id: { in: ids } }
        });
        res.status(200).json({ 
            message: "Bulk delete successful", 
            deletedCount: result.count 
        });
    } catch (error: any) {
        res.status(400).json({ error: error.errors || error.message });
    }
};
