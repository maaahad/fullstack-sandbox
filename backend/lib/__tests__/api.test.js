// ----------------------------------------------------------- //
// import
const fetch = require("isomorphic-fetch");

// ----------------------------------------------------------- //
// variables
// base url
const baseUrl = "http://localhost:3001";
const testTodoListTitle = "Testing TodoList";
const updatedTestTodoListTitle = "Updated : Testing TodoList";
const testTodoTitle = "Please Colmplete the Test First....";
const updatedTestTodoTitle = "Updated : Please Colmplete the Test First....";

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

describe("API Tests", () => {
  // TodoList
  test("/POST /api/todo-list", async () => {
    const todoList = await _fetch("post", "/api/todo-list", {
      title: testTodoListTitle,
    });
    expect(todoList.title).toBe(testTodoListTitle);
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
      (todoList) => todoList.title === testTodoListTitle
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
      (todoList) => todoList.title === testTodoListTitle
    );
    // now we update the title of the todoList
    const updatedTodoList = await _fetch(
      "put",
      `/api/todo-list/${testTodoList._id}`,
      {
        title: updatedTestTodoListTitle,
      }
    );
    //  we assert that testTodoList.title === "Updated : Testing TodoList"
    expect(updatedTodoList.title).toBe(updatedTestTodoListTitle);
  });

  // Todo
  test("/POST /api/todo/:todoListId", async () => {
    // first we get all todo list,
    const todoLists = await _fetch("get", "/api/todo-lists");
    // then we get the one with title === "Updated : Testing TodoList"
    let testTodoList = todoLists.find(
      (todoList) => todoList.title === updatedTestTodoListTitle
    );
    // now we create a Todo, that return the corresponding updated todoList
    const updatedTodoList = await _fetch(
      "post",
      `/api/todo/${testTodoList._id}`,
      {
        title: testTodoTitle,
        due: new Date("2021-12-31"),
      }
    );

    expect(updatedTodoList.todos).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: testTodoTitle,
        }),
      ])
    );
  });

  test("/PUT /api/todo/:id", async () => {
    // first we get all todo list,
    const todoLists = await _fetch("get", "/api/todo-lists");
    // then we get the one with title === "Updated : Testing TodoList"
    let testTodoList = todoLists.find(
      (todoList) => todoList.title === updatedTestTodoListTitle
    );
    // now we get the details of testTodoList and check that the testTodo is in testTodoList
    testTodoList = await await _fetch(
      "get",
      `/api/todo-list/${testTodoList._id}`
    );
    // we filter out the test Todo testTodoList
    const testTodo = testTodoList.todos.find(
      (todo) => todo.title === testTodoTitle
    );

    // now we update the testTodo
    const updatedTestTodo = await _fetch("put", `/api/todo/${testTodo._id}`, {
      title: updatedTestTodoTitle,
      due: testTodo.due,
    });

    // assertions
    expect(updatedTestTodo.title).toBe(updatedTestTodoTitle);
  });

  // test related to deletion of TodoList and Todo comes at the end
  // To make sure that test TodoList and Todo are removed from db once
  // all other tests are done
  test("/DELETE /api/todo/:todoId/:todoListId", async () => {
    // first we get all todo list,
    const todoLists = await _fetch("get", "/api/todo-lists");
    // then we get the one with title === "Updated : Testing TodoList"
    let testTodoList = todoLists.find(
      (todoList) => todoList.title === updatedTestTodoListTitle
    );
    // get details of the testTodoList
    testTodoList = await await _fetch(
      "get",
      `/api/todo-list/${testTodoList._id}`
    );
    // filter out the testTodo
    const testTodo = testTodoList.todos.find(
      (todo) => todo.title === updatedTestTodoTitle
    );

    // delete the testTodo and get the updated corresponding todoList
    const updatedTodoList = await _fetch(
      "delete",
      `/api/todo/${testTodo._id}/${testTodoList._id}`
    );

    // assertions
    expect(updatedTodoList).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: updatedTestTodoTitle,
        }),
      ])
    );
  });

  test("/DELETE /api/todo-list/:id", async () => {
    // first we get all todo list,
    const todoLists = await _fetch("get", "/api/todo-lists");
    // then we get the one with title === "Updated : Testing TodoList"
    const testTodoList = todoLists.find(
      (todoList) => todoList.title === updatedTestTodoListTitle
    );
    // now we fetch the todoList with id
    const deletedTodoList = await _fetch(
      "delete",
      `/api/todo-list/${testTodoList._id}`
    );
    //  we assert that deletedTodoList.title === "Updated : Testing TodoList"
    expect(deletedTodoList.title).toBe(updatedTestTodoListTitle);
  });
});
