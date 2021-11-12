// ----------------------------------------------------------- //
// importing

// modules
const mongoose = require("mongoose");

// ----------------------------------------------------------- //
// toDoList schema

const todoListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  todos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo" }],
  // The following properties will be added if time permits
  // completed: {
  //   type: Boolean,
  //   default: false,
  // },
  // todoOverdued: {
  //   type: Boolean,
  //   default: false,
  // },
});

// ToDoList model
const TodoList = mongoose.model("TodoList", todoListSchema);

module.exports = TodoList;
