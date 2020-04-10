import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { IOption, IQuestion } from "../logic/schema";

export const RadioSelect: React.FC<{
  currentQuestion: IQuestion;
  onChange: React.Dispatch<React.SetStateAction<{}>>;
}> = ({ currentQuestion, onChange }) => {
  const handleChange = (e: any) => {
    if (currentQuestion.options !== undefined) {
      onChange(e.currentTarget.value);
    } else {
      // it is a boolean question if options are not set
      onChange(e.currentTarget.value === "true");
    }
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
