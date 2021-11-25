import React from "react";
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

export const ToDoListForm = ({ toDoList, reFetchToDoLists = (f) => f }) => {
  const classes = useStyles();

  const addToDo = () => {
    getJSON("post", `${credentials.api.BASE_URL}/todo/${toDoList._id}`, {
      title: "",
      due: null,
      completed: false,
    }).then((toDoList) => {
      reFetchToDoLists();
    });
  };

  const deleteTodo = (toDo) => {
    getJSON(
      "delete",
      `${credentials.api.BASE_URL}/todo/${toDo._id}/${toDoList._id}`
    ).then((toDoList) => {
      reFetchToDoLists();
    });
  };

  if (!toDoList) return null;
  return (
    <Card className={classes.card}>
      <CardContent>
        <div className={classes.todolistHeader}>
          <Typography component="h2">{toDoList.title}</Typography>
        </div>
        <form className={classes.form}>
          {toDoList.todos.map((toDo, index) => (
            <ToDo
              key={toDo._id}
              toDo={toDo}
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
