import React from "react";
import { RadioSelect } from "./RadioSelect";
import { DecimalInput } from "./DecimalInput";
import { IQuestion, QuestionType } from "../../logic/schema";
import { MultiSelect } from "./MultiSelect";
import { DatePicker } from "./DatePicker";

export type QuestionComponentProps = {
  currentQuestion: IQuestion;
  onChange: React.Dispatch<
    React.SetStateAction<
      string | boolean | number | Array<string | boolean | number>
    >
  >;
};

export const QuestionComponent: React.FC<QuestionComponentProps> = ({
  currentQuestion,
  onChange,
}) => {
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
        <MultiSelect
          key={currentQuestion.id}
          currentQuestion={currentQuestion}
          onChange={onChange}
        />
      );
    case QuestionType.Date:
      return (
        <DatePicker
          key={currentQuestion.id}
          currentQuestion={currentQuestion}
          onChange={onChange}
        />
      );
    case QuestionType.Decimal:
      return (
        <DecimalInput
          key={currentQuestion.id}
          currentQuestion={currentQuestion}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
};
