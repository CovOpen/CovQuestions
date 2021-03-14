import React from "react";
import { TextField } from "@material-ui/core";
import { QuestionFormComponentProps } from "./QuestionFormComponent";
import { dateInSecondsTimestamp } from "../../utils/date";

export const DatePicker: React.FC<QuestionFormComponentProps> = ({ onChange, value }) => {
  // If the caller send a string date, like 2020-03-25, we should also return a string date.
  const callerExpectsStringDate = typeof value === "string";

  const handleChange = (e: any) => {
    if (callerExpectsStringDate) {
      onChange(e.target.value);
    } else {
      const dateInSeconds = dateInSecondsTimestamp(e.target.value);
      if (isNaN(dateInSeconds)) {
        onChange(undefined);
      } else {
        onChange(dateInSeconds);
      }
    }
  };

  const controlledValue = callerExpectsStringDate
    ? value
    : value !== undefined
    ? new Date(value * 1000).toISOString().slice(0, 10)
    : "";

  return (
    <TextField
      id="date"
      type="date"
      InputLabelProps={{
        shrink: true,
      }}
      onChange={handleChange}
      value={controlledValue}
    />
  );
};
