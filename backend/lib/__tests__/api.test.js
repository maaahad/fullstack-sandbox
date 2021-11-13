// ----------------------------------------------------------- //
// import
const fetch = require("isomorphic-fetch");

// ----------------------------------------------------------- //
// variables
// base url
const baseUrl = "http://localhost:3001";

const _fetch = async (method, path, body) => {
  body = typeof body === "string" ? body : JSON.stringify(body);
  const headers = { "Content-Type": "application/json" };
  const res = await fetch(baseUrl + path, { method, body, headers });
  if (res.status < 200 || res.status > 299) {
    throw new Error(
      `[UNSUCCESSFUL_REQUEST] : Server returned with status ${res.status}`
    );
  }

  return await res.json();
};

// || todo : move repeatative code here ...

describe("API Tests", () => {
  // TodoList
  test("/POST /api/todo-list", async () => {
    const todoList = await _fetch("post", "/api/todo-list", {
      title: "Testing TodoList",
    });
    expect(todoList.title).toBe("Testing TodoList");
  });

  test("/GET /api/todo-lists", async () => {
    const todoLists = await _fetch("get", "/api/todo-lists");
    expect(todoLists.length).not.toBe(0);
  });

  test("/GET /api/todo-list/:id", async () => {
    // first we get all todo list,
    const todoLists = await _fetch("get", "/api/todo-lists");
    // then we get the one with title === "Testing TodoList"
    const testTodoList = todoLists.find(
      (todoList) => todoList.title === "Testing TodoList"
    );
    // now we fetch the todoList with id
    const todoListFromId = await _fetch(
      "get",
      `/api/todo-list/${testTodoList._id}`
    );
    //  we assert that both testTodoList and todoListFromId got the same title
    expect(todoListFromId.title).toBe(testTodoList.title);
  });

  test("/PUT /api/todo-list/:id", async () => {
    // first we get all todo list,
    const todoLists = await _fetch("get", "/api/todo-lists");
    // then we get the one with title === "Testing TodoList"
    const testTodoList = todoLists.find(
      (todoList) => todoList.title === "Testing TodoList"
    );
    // now we fetch the todoList with id
    const updatedTodoList = await _fetch(
      "put",
      `/api/todo-list/${testTodoList._id}`,
      {
        title: "Updated : Testing TodoList",
      }
    );
    //  we assert that testTodoList.title === "Updated : Testing TodoList"
    expect(updatedTodoList.title).toBe("Updated : Testing TodoList");
  });

  // Todo
  test("/POST /api/todo/:todoListId", async () => {
    // first we get all todo list,
    const todoLists = await _fetch("get", "/api/todo-lists");
    // then we get the one with title === "Updated : Testing TodoList"
    let testTodoList = todoLists.find(
      (todoList) => todoList.title === "Updated : Testing TodoList"
    );
    // now we create a Todo
    const testTodo = await _fetch("post", `/api/todo/${testTodoList._id}`, {
      title: "Please Colmplete the Test First....",
      due: new Date("2021-12-31"),
    });

    // now we get the details of testTodoList and check that the testTodo is in testTodoList
    testTodoList = await await _fetch(
      "get",
      `/api/todo-list/${testTodoList._id}`
    );
    expect(testTodoList.todos).toEqual(
      expect.arrayContaining([expect.objectContaining({ _id: testTodo._id })])
    );
  });

  test("/PUT /api/todo/:id", async () => {
    // first we get all todo list,
    const todoLists = await _fetch("get", "/api/todo-lists");
    // then we get the one with title === "Updated : Testing TodoList"
    let testTodoList = todoLists.find(
      (todoList) => todoList.title === "Updated : Testing TodoList"
    );
    // now we get the details of testTodoList and check that the testTodo is in testTodoList
    testTodoList = await await _fetch(
      "get",
      `/api/todo-list/${testTodoList._id}`
    );
    // we filter out the test Todo testTodoList
    const testTodo = testTodoList.todos.find(
      (todo) => todo.title === "Please Colmplete the Test First...."
    );
    // now we update the testTodo
    const updatedTestTodo = await _fetch("put", `/api/todo/${testTodo._id}`, {
      title: "Updated : Please Colmplete the Test First....",
      due: testTodo.due,
    });

    // assertions
    expect(updatedTestTodo.title).toBe(
      "Updated : Please Colmplete the Test First...."
    );
  });

  test("/DELETE /api/todo/:todoId/:todoListId", async () => {
    // first we get all todo list,
    const todoLists = await _fetch("get", "/api/todo-lists");
    // then we get the one with title === "Updated : Testing TodoList"
    let testTodoList = todoLists.find(
      (todoList) => todoList.title === "Updated : Testing TodoList"
    );
    // now we get the details of testTodoList and check that the testTodo is in testTodoList
    testTodoList = await await _fetch(
      "get",
      `/api/todo-list/${testTodoList._id}`
    );
    const testTodo = testTodoList.todos.find(
      (todo) => todo.title === "Updated : Please Colmplete the Test First...."
    );

    const deletedTodo = await _fetch(
      "delete",
      `/api/todo/${testTodo._id}/${testTodoList._id}`
    );

    expect(deletedTodo._id).toBe(testTodo._id);
    // we also checked whether the todo is deleted from the corresponding TodoList
    // re-fetch the testTodoList
    testTodoList = await await _fetch(
      "get",
      `/api/todo-list/${testTodoList._id}`
    );
    expect(testTodoList.todos).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ _id: deletedTodo._id }),
      ])
    );
  });

  // test related to deletion of TodoList and Todo comes at the end
  // To make sure that test TodoList and Todo are removed from db once
  // test is done
  test("/DELETE /api/todo-list/:id", async () => {
    // first we get all todo list,
    const todoLists = await _fetch("get", "/api/todo-lists");
    // then we get the one with title === "Updated : Testing TodoList"
    const testTodoList = todoLists.find(
      (todoList) => todoList.title === "Updated : Testing TodoList"
    );
    // now we fetch the todoList with id
    const deletedTodoList = await _fetch(
      "delete",
      `/api/todo-list/${testTodoList._id}`
    );
    //  we assert that deletedTodoList.title === "Updated : Testing TodoList"
    expect(deletedTodoList.title).toBe("Updated : Testing TodoList");
  });
});
