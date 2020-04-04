import React from "react";
import { RadioSelect } from "./RadioSelect";
import { DateInput } from "./DateInput";
import { Question } from "../App";

export const QuestionForm: React.FC<{
  currentQuestion: Question;
  onChange: any;
}> = ({ currentQuestion, onChange }) => {
  switch (currentQuestion.type) {
    case "RadioSelect":
      return (
        <RadioSelect
          key={currentQuestion.id}
          currentQuestion={currentQuestion as any}
          onChange={onChange}
        />
      );
    case "Date":
      return (
        <DateInput
          key={currentQuestion.id}
          currentQuestion={currentQuestion}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
};
