import React from "react";
import { RadioSelect } from "./RadioSelect";
import { NumericInput } from "./NumericInput";
import { QuestionType } from "../../logic/schema";
import { MultiSelect } from "./MultiSelect";
import { DatePicker } from "./DatePicker";
import { Primitive } from "../../Primitive";
import { TextInput } from "./TextInput";
import { Question } from "../../logic/questionnaire";

export type QuestionFormComponentProps = {
  currentQuestion: Question;
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
    case QuestionType.Number:
      return <NumericInput key={currentQuestion.id} currentQuestion={currentQuestion} onChange={onChange} />;
    case QuestionType.Text:
      return <TextInput key={currentQuestion.id} currentQuestion={currentQuestion} onChange={onChange} />;
    default:
      exhaustiveCheck(currentQuestion.type);
      return null;
  }
};

const exhaustiveCheck = (_: never): void => {
  return;
};
