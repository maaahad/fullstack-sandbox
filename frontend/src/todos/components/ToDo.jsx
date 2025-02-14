import React from "react";
import { makeStyles } from "@material-ui/styles";
import { useTheme } from "@mui/material/styles";
import { TextField, Button, Typography, Checkbox } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@mui/icons-material/Done";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

import { parseISO, formatDistanceToNow } from "date-fns";
import { useAutoSave, SAVING_STATE } from "../../hooks";
import { credentials } from "../../config";

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

// This method compute the duration to due date relative to NOW
// And decide whether this toDo is overdued / completed
// Otherwise return the remaining time to finish
function getTodosDueStatus(dueDate) {
  let status = "";
  try {
    if (dueDate) {
      const today = new Date();
      if (today > dueDate) status = "overdue";
      else {
        const date = parseISO(dueDate.toISOString());
        const timeDuration = formatDistanceToNow(date);
        status = `${timeDuration} remaining`;
      }
    }
  } catch (error) {
    status = "invalid deadline";
  }

  return status;
}

export default function ToDo({
  toDo,
  onDeleteToDo = (f) => f,
  reFetchToDoLists = (f) => f,
}) {
  const [savingState, _toDo, error, save] = useAutoSave(toDo);
  const classes = useStyles();
  const theme = useTheme();

  const onTitleChange = (event) => {
    save("put", `${credentials.api.BASE_URL}/todo/${_toDo._id}`, {
      title: event.target.value,
      due: _toDo.due,
      completed: _toDo.completed,
    });
  };

  const onCompletionCheck = (event) => {
    // In this case we need to trigger a method to propagate completion state in ToDoLists
    save(
      "put",
      `${credentials.api.BASE_URL}/todo/${_toDo._id}`,
      {
        title: _toDo.title,
        due: _toDo.due,
        completed: event.target.checked,
      },
      reFetchToDoLists
    );
  };

  const onDueDateChange = (newDate) => {
    save("put", `${credentials.api.BASE_URL}/todo/${_toDo._id}`, {
      title: _toDo.title,
      due: newDate,
      completed: _toDo.completed,
    });
  };

  if (error) return <h6>{error.message}</h6>;
  if (!_toDo) return null;
  return (
    <div>
      <div className={classes.todoLine}>
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
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          className={classes.datePicker}
        >
          <DatePicker
            openTo="year"
            views={["year", "month", "day"]}
            label="Due date"
            value={_toDo.due}
            onChange={onDueDateChange}
            renderInput={(params) => (
              <TextField {...params} helperText={null} />
            )}
            disabled={_toDo.completed}
          />
        </LocalizationProvider>
        <Typography
          align="center"
          variant="subtitle2"
          disabled={_toDo.completed}
          className={classes.todoTimestamp}
          color={
            _toDo.completed
              ? "primary"
              : getTodosDueStatus(new Date(_toDo.due)).includes("remaining")
              ? "primary"
              : "secondary"
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
        {savingState === SAVING_STATE.saved && <DoneIcon size="small" />}
        {savingState}
      </Typography>
    </div>
  );
}
