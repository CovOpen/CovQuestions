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
  enableWhenString?: string;
};

export interface EditorResultCategory extends ResultCategory {
  results: EditorResult[];
}

export interface EditorResult extends Result {
  valueString?: string; // TODO: Maybe we can come up with a better name than value.
}

export interface EditorVariable extends Variable {
  valueString?: string; // TODO: Maybe we can come up with a better name than value.
}

export interface EditorQuestionnaireMeta extends QuestionnaireMeta {
  language: ISOLanguage;
  title: string;
}
