// ----------------------------------------------------------- //
// importing

// modules
const mongoose = require("mongoose");

// ----------------------------------------------------------- //
// todo schema
const todoSchema = new mongoose.Schema({
  title: String,
  due: Date,
  completed: {
    type: Boolean,
    default: false,
  },
  // We don't need this
  // Frontend can figure it out
  overdue: {
    type: Boolean,
    default: false,
  },
});

// Todo model
const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
