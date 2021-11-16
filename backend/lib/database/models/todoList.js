// ----------------------------------------------------------- //
// importing

// modules
const mongoose = require("mongoose");

// ----------------------------------------------------------- //
// toDoList schema

const todoListSchema = new mongoose.Schema({
  title: String,
  todos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo" }],
  completed: {
    type: Boolean,
    default: false,
  },
});

// ToDoList model
const TodoList = mongoose.model("TodoList", todoListSchema);

module.exports = TodoList;
