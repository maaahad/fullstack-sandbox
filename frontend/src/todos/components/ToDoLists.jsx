import React, { Fragment, useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ReceiptIcon from "@material-ui/icons/Receipt";
import Typography from "@material-ui/core/Typography";
import { ToDoListForm } from "./ToDoListForm";

// in-house
import { jsonFetch } from "../../hooks";

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const getPersonalTodos = () => {
//   return sleep(1000).then(() =>
//     Promise.resolve({
//       "0000000001": {
//         id: "0000000001",
//         title: "First List",
//         todos: ["First todo of first list!"],
//       },
//       "0000000002": {
//         id: "0000000002",
//         title: "Second List",
//         todos: ["First todo of second list!"],
//       },
//     })
//   );
// };

// || todo : move this to credentials file
// Some useful variables
const BASE_URL_TO_API = "http://localhost:3001/api";

export const ToDoLists = ({ style }) => {
  const [toDoLists, setToDoLists] = useState([]);
  const [activeList, setActiveList] = useState();

  // || todo : handle loading and error state of fetch

  useEffect(() => {
    jsonFetch("get", `${BASE_URL_TO_API}/todo-lists`).then(setToDoLists);
  }, []);

  const onToDoCompletion = () => {
    jsonFetch("get", `${BASE_URL_TO_API}/todo-lists`).then(setToDoLists);
  };

  if (!toDoLists.length) return null;
  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Typography component="h2">My ToDo Lists</Typography>
          <List>
            {toDoLists.map((todolist) => (
              <ListItem
                key={todolist._id}
                button
                onClick={() => setActiveList(todolist)}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText
                  primary={todolist.title + "  " + todolist.completed}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {activeList && (
        <ToDoListForm
          key={activeList._id} // use key to make React recreate component to reset internal state
          toDoList={activeList}
          onToDoCompletion={onToDoCompletion}
        />
      )}
    </Fragment>
  );
};
