// ----------------------------------------------------------- //
// importing
// npm-modules
const mongoose = require("mongoose");
const { credentials } = require("../../config");

// models
const TodoList = require("./models/todoList");
const Todo = require("./models/todo");

// ----------------------------------------------------------- //
// connection string
const connectionString = credentials.mongodb.connectionString;

if (!connectionString) {
  console.error("MongoDB connection string missing. Exiting...");
  process.exit(1);
}

// ----------------------------------------------------------- //
// connecting to MongoDB and registering handler to db
mongoose.connect(connectionString, {});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error(`MongoDB error: ${error.message}`);
  process.exit(1);
});

db.once("open", () => {
  console.log("Connection to MongoDB was successfull");
});

// ----------------------------------------------------------- //
//testing model
// || todo : remove

/* eslint-disable no-unused-vars */
async function testingModel() {
  const todo = new Todo({
    title: "Testing ToDo",
    due: new Date("2021-12-31"),
  });
  await todo.save();
  console.log(todo);

  const todoList = new TodoList({
    title: "First ToDoList",
    todos: [todo._id],
  });
  await todoList.save();
  console.log(todo, "\n", todoList);
}
/* eslint-enable no-unused-vars */
// testingModel();

// ----------------------------------------------------------- //
// exposing methods from db for CRUD operations
module.exports = {
  // db access methods related to TodoList
  getAllTodoList: async () => await TodoList.find({}, "-todos"),
  getTodoListById: async (id) => await TodoList.findById(id).populate("todos"),
  deleteTodoListById: async (id) => await TodoList.findByIdAndDelete(id),
  // initially all TodoList have no todos
  createTodoList: async (title) => await TodoList.create({ title, todos: [] }),
  updateTodoListById: async (id, title = null, todo = null) => {
    if (title) {
      return await TodoList.findByIdAndUpdate(id, { title }, { new: true });
    } else if (todo) {
      // first we need to dreate the todo
      const todo = await Todo.create({
        title: todo.title,
        due: todo.due,
      });
      // now we add the todo to the corresponding todoList
      return await TodoList.findByIdAndUpdate(
        id,
        {
          $push: { todos: todo._id },
        },
        { new: true }
      );
    }
  },

  // a method to add a Todo to a TodoList
  addTodoToTodoList: async (todoListId, todoId) =>
    await TodoList.findByIdAndUpdate(
      todoListId,
      {
        $push: { todos: todoId },
      },
      {
        new: true,
      }
    ),

  // a method to remove a Todo from a TodoList
  deleteTodoFromTodoList: async (todoListId, todoId) =>
    await TodoList.findByIdAndUpdate(
      todoListId,
      {
        $pull: { todos: todoId },
      },
      {
        new: true,
      }
    ),

  // db access method  related to Todo
  createTodo: async (title, due) => await Todo.create({ title, due }),
  deleteTodoById: async (id) => await Todo.findByIdAndDelete(id),
  updateTodoById: async (id, title, due) =>
    await Todo.findByIdAndUpdate(
      id,
      {
        title,
        due,
      },
      {
        new: true,
      }
    ),
};
