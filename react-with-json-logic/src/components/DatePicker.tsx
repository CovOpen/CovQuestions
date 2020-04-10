import React from "react";
import { TextField, Typography } from "@material-ui/core";
import { IQuestion } from "../logic/schema";

export const DatePicker: React.FC<{
  currentQuestion: IQuestion;
  onChange: React.Dispatch<React.SetStateAction<{}>>;
}> = ({ currentQuestion, onChange }) => {
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
