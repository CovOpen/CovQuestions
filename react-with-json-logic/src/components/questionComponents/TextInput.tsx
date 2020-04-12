import React from "react";
import { TextField, FormControl, FormLabel } from "@material-ui/core";
import { QuestionFormComponentProps } from "./QuestionFormComponent";

export const TextInput: React.FC<QuestionFormComponentProps> = ({ currentQuestion, onChange }) => {
  const handleChange = (e: any) => {
    const value = e.target.value;
    if (value.trim() === "") {
      onChange(undefined);
    } else {
      onChange(value);
    }
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{currentQuestion.text}</FormLabel>
      <TextField id={currentQuestion.id} autoFocus={true} onChange={handleChange} />
    </FormControl>
  );
};
