import React from "react";
import { TextField, Typography } from "@material-ui/core";
import { QuestionFormComponentProps } from "./QuestionFormComponent";
import { dateInSecondsTimestamp } from "../../utils/date";

export const DatePicker: React.FC<QuestionFormComponentProps> = ({ currentQuestion, onChange }) => {
  const handleChange = (e: any) => {
    const dateInSeconds = dateInSecondsTimestamp(e.target.value);
    if (isNaN(dateInSeconds)) {
      onChange(undefined);
    } else {
      onChange(dateInSeconds);
    }
  };

  return (
    <>
      <Typography id="date-picker-inline" gutterBottom>
        {currentQuestion.text}
      </Typography>
      <TextField
        id="date"
        type="date"
        defaultValue=""
        InputLabelProps={{
          shrink: true,
        }}
        onChange={handleChange}
      />
    </>
  );
};
