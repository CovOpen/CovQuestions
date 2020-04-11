import React from "react";
import { RadioSelect } from "./RadioSelect";
import { TemperatureInput } from "./TemperatureInput";
import { IQuestion, QuestionType } from "../logic/schema";
import { MultiSelect } from "./MultiSelect";
import { DatePicker } from "./DatePicker";

export const QuestionForm: React.FC<{
  currentQuestion: IQuestion;
  onChange: any;
}> = ({ currentQuestion, onChange }) => {
  switch (currentQuestion.type) {
    case QuestionType.Select:
    case QuestionType.Boolean:
      return (
        <RadioSelect
          key={currentQuestion.id}
          currentQuestion={currentQuestion}
          onChange={onChange}
        />
      );
    case QuestionType.Multiselect:
      return (
        <MultiSelect currentQuestion={currentQuestion} onChange={onChange} />
      );
    case QuestionType.Date:
      return (
        <DatePicker currentQuestion={currentQuestion} onChange={onChange} />
      );
    case QuestionType.Decimal:
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
