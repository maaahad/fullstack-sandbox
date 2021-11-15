import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Checkbox,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import DateTimePicker from "@mui/lab/DateTimePicker";

// date-fns
import { parseISO, formatDistanceToNow } from "date-fns";

// in-house
import { jsonFetch } from "../../hooks";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: "1rem",
  },
  todoLine: {
    display: "flex",
    alignItems: "center",
    color: (_toDo) => (_toDo.completed ? "green" : "red"),
  },
  textField: {
    flexGrow: 1,
    marginRight: "20px",
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

// || move it to separate module
function TimeRemaining({ timestamp }) {
  let timeRemaining = "";
  if (timestamp) {
    const date = parseISO(timestamp);
    const timeDuration = formatDistanceToNow(date);
    timeRemaining = `${timeDuration} remaining`;
  }

  return <span>{timeRemaining}</span>;
}

function getTodosDueStatus(dueDate) {
  let status = "";
  if (dueDate) {
    const today = new Date();
    if (today > dueDate) status = "overdue";
    else {
      const date = parseISO(dueDate.toISOString());
      const timeDuration = formatDistanceToNow(date);
      status = `${timeDuration} remaining`;
    }
  }
  return status;
}

// || todo : move this to credentials file
// Some useful variables
const BASE_URL_TO_API = "http://localhost:3001/api";

function ToDo({
  toDo,
  index,
  onDeleteToDo = (f) => f,
  onToDoCompletion = (f) => f,
}) {
  const [_toDo, setToDo] = useState(toDo);
  const classes = useStyles(_toDo);

  const onTitleChange = (event) => {
    jsonFetch("put", `${BASE_URL_TO_API}/todo/${_toDo._id}`, {
      title: event.target.value,
      due: _toDo.due,
      completed: _toDo.completed,
    }).then(setToDo);
  };

  const onCompletionCheck = (event) => {
    // we need to trigger a method from TodoLists to update existing
    // TodoList in case all todos related to this is done
    jsonFetch("put", `${BASE_URL_TO_API}/todo/${_toDo._id}`, {
      title: _toDo.title,
      due: _toDo.due,
      completed: event.target.checked,
    })
      .then(setToDo)
      .then(() => onToDoCompletion());
  };

  const onDueDateChange = (newDate) => {
    jsonFetch("put", `${BASE_URL_TO_API}/todo/${_toDo._id}`, {
      title: _toDo.title,
      due: newDate,
      completed: _toDo.completed,
    }).then(setToDo);
  };

  if (!_toDo) return null;
  return (
    <div key={index} className={classes.todoLine}>
      <Checkbox
        size="small"
        color="primary"
        checked={_toDo.completed}
        onChange={onCompletionCheck}
      />
      <TextField
        label="What to do?"
        value={_toDo.title}
        onChange={onTitleChange}
        className={classes.textField}
        disabled={_toDo.completed}
      />
      {/* here we have due date */}
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        className={classes.standardSpace}
      >
        <DateTimePicker
          openTo="year"
          views={["year", "month", "day"]}
          minDate={new Date("2021-11-01")}
          label="Due date"
          value={_toDo.due}
          onChange={onDueDateChange}
          renderInput={(params) => <TextField {...params} helperText={null} />}
          disabled={_toDo.completed}
        />
      </LocalizationProvider>
      {/* here we add information related to time remaining / over dues */}
      <Typography
        align="center"
        className={classes.standardSpace}
        variant="overline"
        disabled={_toDo.completed}
      >
        {_toDo.completed
          ? "completed"
          : _toDo.due
          ? getTodosDueStatus(new Date(_toDo.due))
          : "no deadline"}
      </Typography>
      <Button
        size="small"
        color="secondary"
        className={classes.standardSpace}
        onClick={() => onDeleteToDo(_toDo._id)}
      >
        <DeleteIcon />
      </Button>
    </div>
  );
}

export const ToDoListForm = ({
  toDoList,
  saveToDoList = (f) => f,
  onToDoCompletion = (f) => f,
}) => {
  const classes = useStyles();
  const [todos, setTodos] = useState([...toDoList.todos]);

  // || don't think we need this anymore
  // In case we add autosave functionality
  const handleSubmit = (event) => {
    event.preventDefault();
    // saveToDoList(toDoList._id, { todos })
  };

  const addToDo = (event) => {
    jsonFetch("post", `${BASE_URL_TO_API}/todo/${toDoList._id}`, {
      title: "",
      // date needs to come from user input
      due: null,
      completed: false,
    }).then((todos) => setTodos([...todos]));
  };

  const deleteTodo = (toDoId) => {
    jsonFetch(
      "delete",
      `${BASE_URL_TO_API}/todo/${toDoId}/${toDoList._id}`
    ).then((todos) => setTodos([...todos]));
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography component="h2">{toDoList.title}</Typography>
        <form onSubmit={handleSubmit} className={classes.form}>
          {todos.map((toDo, index) => (
            <ToDo
              key={toDo._id}
              toDo={toDo}
              index={index}
              onDeleteToDo={deleteTodo}
              onToDoCompletion={onToDoCompletion}
            />
          ))}
          <CardActions>
            <Button type="button" color="primary" onClick={addToDo}>
              Add Todo <AddIcon />
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  );
};
