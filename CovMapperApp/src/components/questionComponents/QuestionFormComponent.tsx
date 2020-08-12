import React from 'react';
import { RadioSelect } from './RadioSelect';
import { exhaustiveCheck } from './utils/exhaustiveCheck';
import { NumericOption, Option, QuestionType, } from 'covquestions-js/models/Questionnaire.generated';
import { Primitive } from 'covquestions-js/primitive';

type ReducedQuestionType = {
  id: string;
  type: QuestionType;
  text: string;
  options?: Option[];
  numericOption?: NumericOption;
};

export type QuestionFormComponentProps = {
  currentQuestion: ReducedQuestionType;
  onChange: React.Dispatch<
    React.SetStateAction<Primitive | Array<Primitive> | undefined>
  >;
  value?: any;
};

export const QuestionFormComponent: React.FC<QuestionFormComponentProps> = ({
  currentQuestion,
  onChange,
  value,
}) => {
  switch (currentQuestion.type) {
    case 'select':
      return (
        <RadioSelect
          key={currentQuestion.id}
          currentQuestion={currentQuestion}
          onChange={onChange}
          value={value}
        />
      );
    case 'boolean':
    case 'multiselect':
    case 'date':
    case 'number':
    case 'text':
      console.log('Not implemented yet');
      return null;
    default:
      exhaustiveCheck(currentQuestion.type);
      return null;
  }
};
