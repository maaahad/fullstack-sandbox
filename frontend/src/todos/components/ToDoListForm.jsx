import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Chip,
} from "@material-ui/core";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@material-ui/icons/Add";

// in-house
import ToDo from "./ToDo";
import { getJSON } from "../../getJSON";
import { credentials } from "../../config";

const useStyles = makeStyles({
  card: {
    margin: "1rem",
  },
  todolistHeader: {
    display: "flex",
    flexFlow: "row nowrap",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: "20px",
    "& > * + *": {
      marginLeft: "10px",
      width: "auto",
    },
  },
  standardSpace: {
    margin: "8px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    "& > * + *": {
      marginTop: "30px",
    },
  },
});

export const ToDoListForm = ({
  toDoListId,
  toDoListCompleted,
  reFetchToDoLists = (f) => f,
}) => {
  const [toDoList, setToDoList] = useState();
  const classes = useStyles();

  // useEffect to fetch the details of todoList using toDoListId
  // toDoListCompleted is added as dependency to trigger refetching the todolist
  // when completed status of toDoList changes
  useEffect(() => {
    getJSON("get", `${credentials.api.BASE_URL}/todo-list/${toDoListId}`).then(
      setToDoList
    );
  }, [toDoListCompleted, toDoListId]);

  const addToDo = () => {
    getJSON("post", `${credentials.api.BASE_URL}/todo/${toDoList._id}`, {
      title: "",
      due: null,
      completed: false,
    }).then((toDoList) => {
      setToDoList(toDoList);
      // We need to notify parent (ToDoLists) to update the completion of this todoList
      // in case the todolist is already completed
      reFetchToDoLists();
    });
  };

  const deleteTodo = (toDo) => {
    getJSON(
      "delete",
      `${credentials.api.BASE_URL}/todo/${toDo._id}/${toDoList._id}`
    ).then((toDoList) => {
      setToDoList(toDoList);
      // We need to notify parent in case deleted todo was not completed
      reFetchToDoLists();
    });
  };

  if (!toDoList) return null;
  return (
    <Card className={classes.card}>
      <CardContent>
        <div className={classes.todolistHeader}>
          <Typography component="h2">{toDoList.title}</Typography>
          {toDoList.completed && (
            <Chip
              label="Completed"
              color="primary"
              size="small"
              icon={<CheckCircleIcon />}
              variant="outlined"
            />
          )}
        </div>
        <form className={classes.form}>
          {toDoList.todos.map((toDo, index) => (
            <ToDo
              key={toDo._id}
              toDo={toDo}
              index={index}
              onDeleteToDo={deleteTodo}
              reFetchToDoLists={reFetchToDoLists}
            />
          ))}
          <CardActions>
            <Button type="button" color="primary" onClick={addToDo}>
              Add Todo <AddIcon />
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  );
};
