// ----------------------------------------------------------- //
// importing

// modules
const mongoose = require("mongoose");

// ----------------------------------------------------------- //
// todo schema
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  due: Date,
  completed: {
    type: Boolean,
    default: false,
  },
  overdue: {
    type: Boolean,
    default: false,
  },
});

// ToDo model
const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
