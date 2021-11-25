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
  const [activeListId, setActiveListId] = useState();

  const reFetchToDoLists = () => {
    getJSON("get", `${credentials.api.BASE_URL}/todo-lists`).then(
      (toDoLists) => {
        setToDoLists(toDoLists);
      }
    );
  };

  useEffect(() => {
    reFetchToDoLists();
    // getJSON("get", `${credentials.api.BASE_URL}/todo-lists`).then(setToDoLists);
  }, []);

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
                onClick={() => setActiveListId(todolist._id)}
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

      {activeListId && (
        <ToDoListForm
          key={activeListId} // use key to make React recreate component to reset internal state
          toDoListId={activeListId}
          reFetchToDoLists={reFetchToDoLists}
        />
      )}
    </Fragment>
  );
};
