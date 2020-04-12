import React from "react";
import { Slider, Typography } from "@material-ui/core";
import { QuestionFormComponentProps } from "./QuestionFormComponent";

export type NumericInputComponentProps = QuestionFormComponentProps & {
  defaultValue: number;
  min: number;
  max: number;
  step: number;
};

export const NumericInput: React.FC<NumericInputComponentProps> = ({
  currentQuestion,
  onChange,
  defaultValue,
  min,
  max,
  step,
}) => {
  const handleChange = (_e: React.ChangeEvent<{}>, value: number | number[]) => {
    onChange(value);
  };

  return (
    <>
      <Typography id="discrete-slider-always" gutterBottom>
        {currentQuestion.text}
      </Typography>
      <Slider
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={step}
        key={currentQuestion.id}
        name={currentQuestion.id}
        onChange={handleChange}
        aria-labelledby="discrete-slider-always"
        valueLabelDisplay="on"
      />
    </>
  );
};
