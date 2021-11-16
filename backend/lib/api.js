// ----------------------------------------------------------- //
// import
const express = require("express");

// in-house modules
const handlers = require("./handlers");

// in instance of express router
const router = express.Router();

// api routes related to TodoList
router.get("/todo-lists", handlers.getAllTodoList);
router.get("/todo-list/:id", handlers.getTodoListById);

// This following THREE api end points used for TESTING purpose
// Can be used in future extension
router.delete("/todo-list/:id", handlers.deleteTodoListById);
router.post("/todo-list", handlers.createTodoList);
router.put("/todo-list/:id", handlers.updateTodoListById);

// api routes related to Todo
router.post("/todo/:todoListId", handlers.createTodo);
router.put("/todo/:id", handlers.updateTodoById);
router.delete("/todo/:todoId/:todoListId", handlers.deleteTodoById);

module.exports = router;
