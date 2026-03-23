import { Router } from "express";
import { 
    createTodo, 
    getTodosByUserId, 
    getTodoById, 
    updateTodo, 
    deleteTodo, 
    bulkUpdateTodos, 
    bulkDeleteTodos,
    clearCompletedTodos
} from "../controllers/todoController";

const router = Router();

// Bulk operations (should be before /:id)
router.patch("/bulk-update", bulkUpdateTodos);
router.patch("/bulk-update-status", bulkUpdateTodos);
router.delete("/bulk-delete", bulkDeleteTodos);
router.delete("/clear-completed/:userId", clearCompletedTodos);

// Single operations
router.post("/", createTodo);
router.get("/user/:userId", getTodosByUserId);
router.get("/:id", getTodoById);
router.put("/:id", updateTodo);
router.patch("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
