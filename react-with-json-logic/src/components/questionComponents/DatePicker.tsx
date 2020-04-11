import React from "react";
import { TextField, Typography } from "@material-ui/core";
import { QuestionComponentProps } from "./QuestionComponent";

export const DatePicker: React.FC<QuestionComponentProps> = ({
  currentQuestion,
  onChange,
}) => {
  const handleChange = (e: any) => {
    onChange(Math.round(Date.parse(e.target.value) / 1000));
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
