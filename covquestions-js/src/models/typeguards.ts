import { Question, QuestionWithOptions, QuestionWithoutOptions } from './Questionnaire.generated';

export function isQuestionWithOptions(toBeDetermined: Question): toBeDetermined is QuestionWithOptions {
  if (toBeDetermined.type === 'select' || toBeDetermined.type === 'multiselect') {
    return true;
  }
  return false;
}

export function isQuestionWithoutOptions(toBeDetermined: Question): toBeDetermined is QuestionWithoutOptions {
  if (toBeDetermined.type === 'boolean' || toBeDetermined.type === 'date' || toBeDetermined.type === 'text') {
    return true;
  }
  return false;
}
