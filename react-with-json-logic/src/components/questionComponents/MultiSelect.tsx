import React, { useState } from "react";
import { Checkbox, FormControlLabel, FormGroup, FormLabel } from "@material-ui/core";
import { QuestionFormComponentProps } from "./QuestionFormComponent";
import { isPrimitive, Primitive } from "../../Primitive";

export const MultiSelect: React.FC<QuestionFormComponentProps> = ({ currentQuestion, onChange }) => {
  const [selectedValues, setSelectedValues] = useState<Primitive[]>([]);

  const handleChange = (e: React.ChangeEvent<{ value: unknown; checked: boolean }>) => {
    const current = e.target.value;
    let values = selectedValues;
    if (e.target.checked) {
      if (isPrimitive(current)) {
        values.push(current);
      }
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
      {(currentQuestion.options || []).map((answer) => (
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
