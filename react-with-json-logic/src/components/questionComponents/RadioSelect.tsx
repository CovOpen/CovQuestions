import React from "react";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@material-ui/core";
import { Option, QuestionType } from "../../models/Questionnaire";
import { QuestionFormComponentProps } from "./QuestionFormComponent";

export const RadioSelect: React.FC<QuestionFormComponentProps> = ({ currentQuestion, onChange }) => {
  const handleChange = (e: any) => {
    if (currentQuestion.type === QuestionType.Boolean) {
      onChange(e.currentTarget.value === "true");
    } else {
      onChange(e.currentTarget.value);
    }
  };

  const options: Option[] = currentQuestion.options ?? [
    { value: "true", text: "yes" },
    { value: "false", text: "no" },
  ];

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{currentQuestion.text}</FormLabel>
      <RadioGroup name={currentQuestion.id} onChange={handleChange}>
        {options.map((answer) => (
          <FormControlLabel key={answer.value} value={answer.value} control={<Radio />} label={answer.text} />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
