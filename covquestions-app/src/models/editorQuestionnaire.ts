import {
  AnyQuestion,
  ISOLanguage,
  Questionnaire,
  QuestionnaireMeta,
  Result,
  ResultCategory,
  Variable,
} from "covquestions-js/models/Questionnaire.generated";

export interface EditorQuestionnaire extends Questionnaire {
  questions: EditorAnyQuestion[];
  resultCategories: EditorResultCategory[];
  variables: EditorVariable[];
}

export type EditorAnyQuestion = AnyQuestion & {
  enableWhenExpressionString?: string;
};

export interface EditorResultCategory extends ResultCategory {
  results: EditorResult[];
}

export interface EditorResult extends Result {
  expressionString?: string;
}

export interface EditorVariable extends Variable {
  expressionString?: string;
}

export interface EditorQuestionnaireMeta extends QuestionnaireMeta {
  language: ISOLanguage;
  title: string;
}
