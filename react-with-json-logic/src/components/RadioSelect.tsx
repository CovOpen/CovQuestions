import React from "react";
import { QuestionWithValues } from "../App";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";

export const RadioSelect: React.FC<{
  currentQuestion: QuestionWithValues;
  onChange: React.Dispatch<React.SetStateAction<{}>>;
}> = ({ currentQuestion, onChange }) => {
  const handleChange = (e: any) => {
    const currentTargetValue = e.currentTarget.value;
    onChange(currentTargetValue);
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{currentQuestion.question}</FormLabel>
      <RadioGroup name={currentQuestion.id} onChange={handleChange}>
        {currentQuestion.possibleAnswers.map((answer) => (
          <FormControlLabel
            value={answer.value}
            control={<Radio />}
            label={answer.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
