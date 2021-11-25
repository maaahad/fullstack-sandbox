import React, { Fragment, useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ReceiptIcon from "@material-ui/icons/Receipt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";

import { ToDoListForm } from "./ToDoListForm";
import { getJSON } from "../../getJSON";
import { credentials } from "../../config";

export const ToDoLists = ({ style }) => {
  const [toDoLists, setToDoLists] = useState([]);
  const [activeList, setActiveList] = useState();

  useEffect(() => {
    getJSON("get", `${credentials.api.BASE_URL}/todo-lists`).then(setToDoLists);
  }, []);

  const reFetchToDoLists = () => {
    getJSON("get", `${credentials.api.BASE_URL}/todo-lists`).then(
      (toDoLists) => {
        setToDoLists(toDoLists);
        setActiveList(
          toDoLists.find((toDoList) => toDoList._id === activeList._id)
        );
      }
    );
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
                <ListItemText primary={todolist.title} />
                {todolist.todos.every((todo) => todo.completed) && (
                  <Chip
                    label="Completed"
                    color="primary"
                    size="medium"
                    variant="outlined"
                    icon={<CheckCircleIcon />}
                  />
                )}
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {activeList && (
        <ToDoListForm
          key={activeList._id} // use key to make React recreate component to reset internal state
          toDoListId={activeList._id}
          reFetchToDoLists={reFetchToDoLists}
        />
      )}
    </Fragment>
  );
};
