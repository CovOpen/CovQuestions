import React from "react";
import { Slider, Typography } from "@material-ui/core";
import { Question } from "./QuestionnaireExecution";

export const TemperatureInput: React.FC<{
  currentQuestion: Question;
  onChange: React.Dispatch<React.SetStateAction<{}>>;
}> = ({ currentQuestion, onChange }) => {
  const handleChange = (_e: any, value: number) => {
    onChange(value);
  };

  return (
    <>
      <Typography id="discrete-slider-always" gutterBottom>
        {currentQuestion.question}
      </Typography>
      <Slider
        defaultValue={37}
        min={35}
        max={45}
        step={0.1}
        key={currentQuestion.id}
        name={currentQuestion.id}
        onChange={handleChange}
        aria-labelledby="discrete-slider-always"
        valueLabelDisplay="on"
      />
    </>
  );
};
