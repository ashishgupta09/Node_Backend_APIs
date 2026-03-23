import { Request, Response } from "express";
import { Todo } from "../models/todoData";
import { todoSchema, updateTodoSchema, bulkUpdateSchema, bulkDeleteSchema } from "../utils/todoValidation";

// Create Todo
export const createTodo = async (req: Request, res: Response) => {
    try {
        const validatedData = todoSchema.parse(req.body);
        const newTodo = await Todo.create(validatedData);
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

        const query: any = { userId };

        // Filtering
        if (completed !== undefined) {
            query.completed = completed === "true";
        }
        if (priority) {
            query.priority = priority;
        }
        if (search) {
            query.todo = { $regex: search, $options: "i" };
        }

        // Pagination calculations
        const skip = (Number(page) - 1) * Number(limit);

        const todos = await Todo.find(query)
            .sort({ [String(sortBy)]: order === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Todo.countDocuments(query);

        res.status(200).json({
            todos,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit))
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get Todo by ID
export const getTodoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id);
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
        const { id } = req.params;
        const validatedData = updateTodoSchema.parse(req.body);
        const todo = await Todo.findByIdAndUpdate(id, validatedData, { new: true });
        if (!todo) {
            res.status(404).json({ message: "Todo not found" });
            return;
        }
        res.status(200).json(todo);
    } catch (error: any) {
        res.status(400).json({ error: error.errors || error.message });
    }
};

// Delete Todo
export const deleteTodo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findByIdAndDelete(id);
        if (!todo) {
            res.status(404).json({ message: "Todo not found" });
            return;
        }
        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Bulk Update (General)
export const bulkUpdateTodos = async (req: Request, res: Response) => {
    try {
        const { ids, updates } = bulkUpdateSchema.parse(req.body);
        const result = await Todo.updateMany(
            { _id: { $in: ids } },
            { $set: updates }
        );
        res.status(200).json({ 
            message: "Bulk update successful", 
            modifiedCount: result.modifiedCount 
        });
    } catch (error: any) {
        res.status(400).json({ error: error.errors || error.message });
    }
};

// Clear Completed Todos for a User
export const clearCompletedTodos = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const result = await Todo.deleteMany({ userId, completed: true });
        res.status(200).json({ 
            message: "Cleared completed todos successfully", 
            deletedCount: result.deletedCount 
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Bulk Delete Todos
export const bulkDeleteTodos = async (req: Request, res: Response) => {
    try {
        const { ids } = bulkDeleteSchema.parse(req.body);
        const result = await Todo.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ 
            message: "Bulk delete successful", 
            deletedCount: result.deletedCount 
        });
    } catch (error: any) {
        res.status(400).json({ error: error.errors || error.message });
    }
};
