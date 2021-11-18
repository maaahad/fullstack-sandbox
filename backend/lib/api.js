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

// api routes related to Todo
router.post("/todo/:todoListId", handlers.createTodo);
router.put("/todo/:id", handlers.updateTodoById);
router.delete("/todo/:todoId/:todoListId", handlers.deleteTodoById);

module.exports = router;
