import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { IQuestion, IOption } from "../logic/schema";

export const RadioSelect: React.FC<{
  currentQuestion: IQuestion;
  onChange: React.Dispatch<React.SetStateAction<{}>>;
}> = ({ currentQuestion, onChange }) => {
  const handleChange = (e: any) => {
    const currentTargetValue = e.currentTarget.value;
    onChange(currentTargetValue);
  };

  const options: IOption[] = currentQuestion.options ?? [
    { value: "true", text: "yes" },
    { value: "false", text: "no" },
  ];

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{currentQuestion.text}</FormLabel>
      <RadioGroup name={currentQuestion.id} onChange={handleChange}>
        {options.map((answer) => (
          <FormControlLabel
            key={answer.value}
            value={answer.value}
            control={<Radio />}
            label={answer.text}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
