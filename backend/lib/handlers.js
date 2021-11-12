// ----------------------------------------------------------- //
// import
const db = require("./database/db");

module.exports = {
  // handlers related to TodoList
  getAllTodoList: async (req, res) => {
    const todoLists = await db.getAllTodoList();
    res.status(200).json(todoLists);
  },
  getTodoListById: async (req, res) => {
    const todoList = await db.getTodoListById(req.params.id);
    res.status(200).json(todoList);
  },
  deleteTodoListById: async (req, res) => {
    const todoList = await db.deleteTodoListById(req.params.id);
    res.status(200).json(todoList);
  },
  createTodoList: async (req, res) => {
    const todoList = await db.createTodoList(req.body.title);
    res.status(200).json(todoList);
  },
  updateTodoListById: async (req, res) => {
    const todoList = await db.updateTodoListById(
      req.params.id,
      req.body.title,
      req.body.todo
    );
    res.status(200).json(todoList);
  },
};
