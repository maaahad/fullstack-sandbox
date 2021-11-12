const fetch = require("isomorphic-fetch");

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

describe("API Tests", () => {
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
