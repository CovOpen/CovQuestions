import React from "react";
import { RadioSelect } from "./RadioSelect";
import { NumericInput } from "./NumericInput";
import { IQuestion, QuestionType } from "../../logic/schema";
import { MultiSelect } from "./MultiSelect";
import { DatePicker } from "./DatePicker";
import { Primitive } from "../../Primitive";

export type QuestionFormComponentProps = {
  currentQuestion: IQuestion;
  onChange: React.Dispatch<React.SetStateAction<Primitive | Array<Primitive> | undefined>>;
};

export const QuestionFormComponent: React.FC<QuestionFormComponentProps> = ({ currentQuestion, onChange }) => {
  switch (currentQuestion.type) {
    case QuestionType.Select:
    case QuestionType.Boolean:
      return <RadioSelect key={currentQuestion.id} currentQuestion={currentQuestion} onChange={onChange} />;
    case QuestionType.Multiselect:
      return <MultiSelect key={currentQuestion.id} currentQuestion={currentQuestion} onChange={onChange} />;
    case QuestionType.Date:
      return <DatePicker key={currentQuestion.id} currentQuestion={currentQuestion} onChange={onChange} />;
    case QuestionType.Decimal:
      return (
        <NumericInput
          key={currentQuestion.id}
          currentQuestion={currentQuestion}
          onChange={onChange}
          defaultValue={37}
          min={35}
          max={45}
          step={0.1}
        />
      );
    case QuestionType.Integer:
      return (
        <NumericInput
          key={currentQuestion.id}
          currentQuestion={currentQuestion}
          onChange={onChange}
          defaultValue={50}
          min={0}
          max={100}
          step={1}
        />
      );
    default:
      // TODO enable exhaustiveCheck (see below)
      // exhaustiveCheck(currentQuestion.type);
      return null;
  }
};

// const exhaustiveCheck = (_: never): void => {
//   return;
// };
