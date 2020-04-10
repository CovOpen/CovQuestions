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
    case "select":
    case "boolean":
      return (
        <RadioSelect
          key={currentQuestion.id}
          currentQuestion={currentQuestion}
          onChange={onChange}
        />
      );
    case "multiselect":
      return (
        <MultiSelect currentQuestion={currentQuestion} onChange={onChange} />
      );
    case "decimal":
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
