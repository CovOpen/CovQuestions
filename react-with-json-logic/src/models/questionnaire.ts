import { Questionnaire as QuestionnaireBase, AnyQuestion as AnyQuestionBase, ResultCategory as ResultCategoryBase, Result as ResultBase, Variable as VariableBase } from "covquestions-js/models/questionnaire";

export interface Questionnaire extends QuestionnaireBase {
    questions: AnyQuestion[];
    resultCategories: ResultCategory[];
    variables: Variable[];
}

export type AnyQuestion = AnyQuestionBase & {
    enableWhenString?: string;    
}

export interface ResultCategory extends ResultCategoryBase {
    results: Result[];
}

export interface Result extends ResultBase {
    valueString?: string; // TODO: Maybe we can come up with a better name than value.
}

export interface Variable extends VariableBase {
    valueString?: string; // TODO: Maybe we can come up with a better name than value.
}