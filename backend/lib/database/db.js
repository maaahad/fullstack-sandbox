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
// seeding intial data
TodoList.find((error, todoLists) => {
  if (error) return console.error(error);
  if (todoLists.length) return;

  // initial Todos and TodoLists
  const firstTodoFirstList = new Todo({
    title: "First todo of first list!",
    due: new Date("2021-12-31"),
  });

  const firstTodoList = new TodoList({
    title: "First List",
    todos: [firstTodoFirstList._id],
  });

  firstTodoFirstList.save();
  firstTodoList.save();

  const firstTodoSecondList = new Todo({
    title: "First todo of second list!",
    due: new Date("2022-01-20"),
  });

  const secondTodoList = new TodoList({
    title: "Second List",
    todos: [firstTodoSecondList._id],
  });

  firstTodoSecondList.save();
  secondTodoList.save();
});

// ----------------------------------------------------------- //
// exposing methods from db for CRUD operations
module.exports = {
  // db access methods related to TodoList
  getAllTodoList: async () => await TodoList.find({}).populate("todos"),

  getTodoListById: async (id) => await TodoList.findById(id).populate("todos"),

  // a method to add a Todo to a TodoList
  addTodoToTodoList: async (todoListId, todo) => {
    const updatedTodoList = await TodoList.findByIdAndUpdate(
      todoListId,
      {
        $push: { todos: todo._id },
      },
      {
        new: true,
      }
    ).populate("todos");

    return updatedTodoList;
  },

  // a method to remove a Todo from a TodoList
  deleteTodoFromTodoList: async (todoListId, todo) => {
    const updatedTodoList = await TodoList.findByIdAndUpdate(
      todoListId,
      {
        $pull: { todos: todo._id },
      },
      {
        new: true,
      }
    ).populate("todos");

    return updatedTodoList;
  },

  // db access method  related to Todo
  createTodo: async (title, due, completed) =>
    await Todo.create({ title, due, completed }),

  deleteTodoById: async (id) => await Todo.findByIdAndDelete(id),

  updateTodoById: async (id, { title, due, completed }) => {
    // in case completed, we need to update the completed property of
    // corresponding todolist
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        title,
        due,
        completed,
      },
      {
        new: true,
      }
    );
    return updatedTodo;
  },
};
