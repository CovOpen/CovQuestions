import React from "react";
import { RadioSelect } from "./RadioSelect";
import { NumericInput } from "./NumericInput";
import { MultiSelect } from "./MultiSelect";
import { DatePicker } from "./DatePicker";
import { Primitive } from "covquestions-js/primitive";
import { TextInput } from "./TextInput";
import { Question } from "covquestions-js";

export type QuestionFormComponentProps = {
  currentQuestion: Question;
  onChange: React.Dispatch<React.SetStateAction<Primitive | Array<Primitive> | undefined>>;
};

export const QuestionFormComponent: React.FC<QuestionFormComponentProps> = ({ currentQuestion, onChange }) => {
  switch (currentQuestion.type) {
    case "select":
    case "boolean":
      return <RadioSelect key={currentQuestion.id} currentQuestion={currentQuestion} onChange={onChange} />;
    case "multiselect":
      return <MultiSelect key={currentQuestion.id} currentQuestion={currentQuestion} onChange={onChange} />;
    case "date":
      return <DatePicker key={currentQuestion.id} currentQuestion={currentQuestion} onChange={onChange} />;
    case "number":
      return <NumericInput key={currentQuestion.id} currentQuestion={currentQuestion} onChange={onChange} />;
    case "text":
      return <TextInput key={currentQuestion.id} currentQuestion={currentQuestion} onChange={onChange} />;
    default:
      exhaustiveCheck(currentQuestion.type);
      return null;
  }
};

const exhaustiveCheck = (_: never): void => {
  return;
};
