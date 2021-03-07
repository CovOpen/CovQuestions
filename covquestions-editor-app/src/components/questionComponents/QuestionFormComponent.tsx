import React from "react";
import { RadioSelect } from "./RadioSelect";
import { NumericInput } from "./NumericInput";
import { MultiSelect } from "./MultiSelect";
import { DatePicker } from "./DatePicker";
import { Primitive } from "@covopen/covquestions-js";
import { TextInput } from "./TextInput";
import { exhaustiveCheck } from "../../utils/exhaustiveCheck";
import { NumericOptions, Option, QuestionType } from "@covopen/covquestions-js/src/models/Questionnaire.generated";

type ReducedQuestionType = {
  id: string;
  type: QuestionType;
  text: string;
  options?: Option[];
  numericOptions?: NumericOptions;
};

export type QuestionFormComponentProps = {
  currentQuestion: ReducedQuestionType;
  onChange: React.Dispatch<React.SetStateAction<Primitive | Array<Primitive> | undefined>>;
  value?: any;
};

export const QuestionFormComponent: React.FC<QuestionFormComponentProps> = ({ currentQuestion, onChange, value }) => {
  switch (currentQuestion.type) {
    case "select":
    case "boolean":
      return (
        <RadioSelect key={currentQuestion.id} currentQuestion={currentQuestion} onChange={onChange} value={value} />
      );
    case "multiselect":
      return (
        <MultiSelect key={currentQuestion.id} currentQuestion={currentQuestion} onChange={onChange} value={value} />
      );
    case "date":
      return (
        <DatePicker key={currentQuestion.id} currentQuestion={currentQuestion} onChange={onChange} value={value} />
      );
    case "number":
      return (
        <NumericInput key={currentQuestion.id} currentQuestion={currentQuestion} onChange={onChange} value={value} />
      );
    case "text":
      return <TextInput key={currentQuestion.id} currentQuestion={currentQuestion} onChange={onChange} value={value} />;
    default:
      exhaustiveCheck(currentQuestion.type);
      return null;
  }
};
