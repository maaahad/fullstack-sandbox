import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { useTheme } from "@mui/material/styles";
import { TextField, Button, Typography, Checkbox } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@mui/icons-material/Done";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import DateTimePicker from "@mui/lab/DateTimePicker";

// date-fns
import { parseISO, formatDistanceToNow } from "date-fns";

// in-house
import { useAutoSave, jsonFetch } from "../../hooks";

const useStyles = makeStyles((theme) => ({
  todoLine: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: "25px",
    },
  },
  textField: {
    flexGrow: 1,
  },
  datePicker: {},
  todoTimestamp: {
    width: "200px",
  },
  savingState: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: "60px",
    marginTop: "10px",
    height: "30px",
  },
  standardSpace: {
    margin: "8px",
  },
}));

// || move it to separate module
// function TimeRemaining({ timestamp }) {
//   let timeRemaining = "";
//   if (timestamp) {
//     const date = parseISO(timestamp);
//     const timeDuration = formatDistanceToNow(date);
//     timeRemaining = `${timeDuration} remaining`;
//   }

//   return <span>{timeRemaining}</span>;
// }

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

export default function ToDo({
  toDo,
  index,
  onDeleteToDo = (f) => f,
  reFetchToDoLists = (f) => f,
}) {
  const [savingState, _toDo, error, setToDo, save] = useAutoSave(
    "Saved to DB",
    toDo
  );
  // const [_toDo, setToDo] = useState(toDo);
  const classes = useStyles();
  const theme = useTheme();

  const onTitleChange = (event) => {
    // setToDo({ ..._toDo, title: event.target.value });
    save("put", `${BASE_URL_TO_API}/todo/${_toDo._id}`, {
      title: event.target.value,
      due: _toDo.due,
      completed: _toDo.completed,
    });
    // jsonFetch("put", `${BASE_URL_TO_API}/todo/${_toDo._id}`, {
    //   title: event.target.value,
    //   due: _toDo.due,
    //   completed: _toDo.completed,
    // }).then(setToDo);
  };

  const onCompletionCheck = (event) => {
    // we need to trigger a method from TodoLists to update existing
    // TodoList in case all todos related to this is done
    save(
      "put",
      `${BASE_URL_TO_API}/todo/${_toDo._id}`,
      {
        title: _toDo.title,
        due: _toDo.due,
        completed: event.target.checked,
      },
      reFetchToDoLists
    );
    // Need to pass completion check to parent
    // jsonFetch("put", `${BASE_URL_TO_API}/todo/${_toDo._id}`, {
    //   title: _toDo.title,
    //   due: _toDo.due,
    //   completed: event.target.checked,
    // })
    //   .then(setToDo)
    //   .then(() => onToDoCompletion());
  };

  const onDueDateChange = (newDate) => {
    save("put", `${BASE_URL_TO_API}/todo/${_toDo._id}`, {
      title: _toDo.title,
      due: newDate,
      completed: _toDo.completed,
    });
    // jsonFetch("put", `${BASE_URL_TO_API}/todo/${_toDo._id}`, {
    //   title: _toDo.title,
    //   due: newDate,
    //   completed: _toDo.completed,
    // }).then(setToDo);
  };

  if (!_toDo) return null;
  return (
    <div>
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
          className={classes.datePicker}
        >
          <DateTimePicker
            openTo="year"
            views={["year", "month", "day"]}
            minDate={new Date("2021-11-01")}
            label="Due date"
            value={_toDo.due}
            onChange={onDueDateChange}
            renderInput={(params) => (
              <TextField {...params} helperText={null} />
            )}
            disabled={_toDo.completed}
          />
        </LocalizationProvider>
        {/* here we add information related to time remaining / over dues */}
        <Typography
          align="center"
          variant="subtitle2"
          disabled={_toDo.completed}
          className={classes.todoTimestamp}
          color={
            _toDo.completed
              ? "primary"
              : getTodosDueStatus(new Date(_toDo.due)) === "overdue"
              ? "secondary"
              : ""
          }
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
          onClick={() => onDeleteToDo(_toDo)}
        >
          <DeleteIcon />
        </Button>
      </div>
      <Typography
        align="left"
        variant="caption"
        className={classes.savingState}
        style={{
          color: theme.palette.grey[400],
        }}
      >
        {savingState === "Saved to DB" && <DoneIcon size="small" />}
        {savingState}
      </Typography>
    </div>
  );
}
