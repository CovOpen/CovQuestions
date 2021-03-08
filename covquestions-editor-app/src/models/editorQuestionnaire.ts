import {
  ISOLanguage,
  Question,
  Questionnaire,
  QuestionnaireMeta,
  Result,
  ResultCategory,
  Variable,
} from "@covopen/covquestions-js/src/models/Questionnaire.generated";

export interface EditorQuestionnaire extends Questionnaire {
  questions: EditorQuestion[];
  resultCategories: EditorResultCategory[];
  variables: EditorVariable[];
}

export type EditorQuestion = Question & {
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
