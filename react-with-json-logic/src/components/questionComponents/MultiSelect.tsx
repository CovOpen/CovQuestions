import React, { useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@material-ui/core";
import { QuestionComponentProps } from "./QuestionComponent";

export const MultiSelect: React.FC<QuestionComponentProps> = ({
  currentQuestion,
  onChange,
}) => {
  const [selectedValues, setSelectedValues] = useState([]);

  const handleChange = (e: any) => {
    const current = e.target.value;
    let values = selectedValues;
    if (e.target.checked) {
      values.push(current);
    } else {
      values = values.filter((value) => value !== current);
    }
    setSelectedValues(values);
    if (values.length > 0) {
      onChange(values);
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
          label={answer.text}
        />
      ))}
    </FormGroup>
  );
};
