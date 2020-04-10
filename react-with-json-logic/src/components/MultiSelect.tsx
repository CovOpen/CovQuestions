import React from "react";
import { FormControlLabel, FormLabel, Checkbox, FormGroup, } from "@material-ui/core";
import { IQuestion } from "../logic/schema";

export const MultiSelect: React.FC<{
  currentQuestion: IQuestion;
  onChange: React.Dispatch<React.SetStateAction<{}>>;
}> = ({ currentQuestion, onChange }) => {
  let selectedValues: string[] = []

  const handleChange = (e: any) => {
    const current = e.target.value;
    if (e.target.checked) {
      selectedValues.push(current)
    } else {
      selectedValues = selectedValues.filter(value => value !== current);
    }
    if (selectedValues.length > 0) {
      onChange(selectedValues.join());
    } else {
      onChange(undefined);
    }
  };

  return (
    <FormGroup>
      <FormLabel component="legend">{currentQuestion.text}</FormLabel>
      {currentQuestion.options.map((answer) => (
        <FormControlLabel
          key={answer.value}
          value={answer.value}
          control={<Checkbox name="checkedC" onChange={handleChange} />}
          label={answer.text} />
      ))}
    </FormGroup>
  );
};
