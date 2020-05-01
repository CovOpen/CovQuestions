import React from "react";
import { TextField, Typography } from "@material-ui/core";
import { QuestionFormComponentProps } from "./QuestionFormComponent";

export const DatePicker: React.FC<QuestionFormComponentProps> = ({ currentQuestion, onChange }) => {
  const handleChange = (e: any) => {
    const dateInSecondsTimestamp = Math.round(Date.parse(e.target.value) / 1000);
    if (isNaN(dateInSecondsTimestamp)) {
      onChange(undefined);
    } else {
      onChange(dateInSecondsTimestamp);
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
