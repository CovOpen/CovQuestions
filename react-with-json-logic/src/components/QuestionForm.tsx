import React from "react";
import { RadioSelect } from "./RadioSelect";
import { TemperatureInput } from "./TemperatureInput";
import { IQuestion } from "../logic/schema";
import { MultiSelect } from "./MultiSelect";

export const QuestionForm: React.FC<{
  currentQuestion: IQuestion;
  onChange: any;
}> = ({ currentQuestion, onChange }) => {
  switch (currentQuestion.type) {
    case "Select":
    case "Boolean":
      return (
        <RadioSelect
          key={currentQuestion.id}
          currentQuestion={currentQuestion}
          onChange={onChange}
        />
      );
    case "Multiselect":
      return (
        <MultiSelect
          currentQuestion={currentQuestion}
          onChange={onChange}
        />);
    case "Number":
      return (
        <TemperatureInput
          key={currentQuestion.id}
          currentQuestion={currentQuestion}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
};
