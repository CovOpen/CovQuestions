import { NumericQuestion, Question, QuestionWithOptions, QuestionWithoutOptions } from "./Questionnaire.generated";

export function isQuestionWithOptions(toBeDetermined: Question): toBeDetermined is QuestionWithOptions {
  return toBeDetermined.type === "select" || toBeDetermined.type === "multiselect";
}

export function isQuestionWithoutOptions(toBeDetermined: Question): toBeDetermined is QuestionWithoutOptions {
  return toBeDetermined.type === "boolean" || toBeDetermined.type === "date" || toBeDetermined.type === "text";
}

export function isNumericQuestion(toBeDetermined: Question): toBeDetermined is NumericQuestion {
  return toBeDetermined.type === "number";
}
