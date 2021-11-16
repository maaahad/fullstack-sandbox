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
import { jsonFetch } from "../../hooks";

const useStyles = makeStyles((theme) => ({
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
    // update
    "& > * + *": {
      marginTop: "30px",
    },
  },
}));

// || todo : move this to credentials file
// Some useful variables
const BASE_URL_TO_API = "http://localhost:3001/api";

export const ToDoListForm = ({
  toDoListId,
  toDoListCompleted,
  reFetchToDoLists = (f) => f,
}) => {
  // const [todos, setTodos] = useState([...toDoList.todos]);
  const [toDoList, setToDoList] = useState();
  const classes = useStyles();

  // useEffect to fetch the details of todoList
  // we may add a dependency to trigger refetching todolist
  useEffect(() => {
    jsonFetch("get", `${BASE_URL_TO_API}/todo-list/${toDoListId}`).then(
      setToDoList
    );
  }, [toDoListCompleted]);

  // || don't think we need this anymore
  // In case we add autosave functionality
  // const handleSubmit = (event) => {
  //   event.preventDefault();
  // };

  const addToDo = (event) => {
    jsonFetch("post", `${BASE_URL_TO_API}/todo/${toDoList._id}`, {
      title: "",
      due: null,
      completed: false,
    }).then((toDoList) => {
      setToDoList(toDoList);
      // We need to notify parent in to update the completion of this todoList
      // This should only require if current list is completed
      // Rethink the condition here in db
      reFetchToDoLists();
    });
  };

  const deleteTodo = (toDo) => {
    jsonFetch(
      "delete",
      `${BASE_URL_TO_API}/todo/${toDo._id}/${toDoList._id}`
    ).then((toDoList) => {
      setToDoList(toDoList);
      // We need to notify parent in case deleted todo was not completed
      // Rethink the condition here in db
      !toDo.completed && reFetchToDoLists();
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
            // <CheckCircleIcon size="large" color="primary" />
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
            {/* <Button type="submit" variant="contained" color="primary">
              Save
            </Button> */}
          </CardActions>
        </form>
      </CardContent>
    </Card>
  );
};
