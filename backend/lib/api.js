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
router.delete("/todo-list/:id", handlers.deleteTodoListById);
router.post("/todo-list", handlers.createTodoList);
router.put("/todo-list/:id", handlers.updateTodoListById);

module.exports = router;
