// LogicExpression refers to the JSONLogic standard.
import { LogicExpression } from "./logic";

/*
 * This module defines a schema for questionaire and result calulation logic.
 */

/**
 * Type of a question, essentially defines the result type.
 */
export enum QuestionType {
  Select = "select",
  Multiselect = "multiselect",
  Number = "number",
  Boolean = "boolean",
  Date = "date",
  Text = "text",
}

/**
 * Option for multi-select questions.
 */
export interface IOption {
  /**
   * Human-Readable answer, can be localized.
   */
  text: string;
  /**
   * Value used for evaluating logic expressions.
   */
  value: string;
  /**
   * Human-Readable formulation of this option as yes/no question.
   * This is for use-cases where multi-selects are not possible in the UI,
   * for example telephone hotlines.
   */
  asQuestion?: string;
}

/**
 * Option for numeric questions.
 */
export interface INumericOption {
  /**
   * Minimal value
   */
  min?: number;
  /**
   * maximal value
   */
  max?: number;
  /**
   * Step size
   */
  step?: number;
  /**
   * Default value
   */
  defaultValue?: number;
}

/**
 * Represents a question.
 */
interface IQuestionBase {
  /**
   * Unique id for referring this question in logic expressions.
   */
  id: string;
  /**
   * Human-readable question text, can be localized.
   */
  text: string;
  /**
   * Optional human-readable details or clarifiation about this question.
   */
  details?: string;
  /**
   * Boolean indicating whether the question is optional or not.
   */
  optional?: boolean;
  /**
   * Logic expression to decide whether the question should be displayed or not.
   * Defaults to true.
   */
  enableWhen?: LogicExpression;
}

export type IQuestionWithoutOptions = IQuestionBase & {
  /**
   * Type of the question.
   */
  type: QuestionType.Boolean | QuestionType.Date | QuestionType.Text;
};

export type IQuestionWithOptions = IQuestionBase & {
  /**
   * Type of the question.
   */
  type: QuestionType.Select | QuestionType.Multiselect;
  /**
   * Answer options for Select/Multiselect questions.
   */
  options?: IOption[];
};

export type INumericQuestion = IQuestionBase & {
  /**
   * Type of the question.
   */
  type: QuestionType.Number;
  /**
   * Answer options for Select/Multiselect questions.
   */
  numericOptions?: INumericOption;
};

export type IQuestion = IQuestionWithoutOptions | IQuestionWithOptions | INumericQuestion;

/**
 * Represents a variable which is computed from the given answers or other variables.
 */
export interface IVariable {
  /**
   * Unique id for referring this variable in logic expressions.
   */
  id: string;
  /**
   * Logic expression used to compute this variable.
   */
  value: LogicExpression;
}

/**
 * Represents a result category. A category might yield exactly one or zero results at the end of the questionaire.
 */
export interface IResultCategory {
  /**
   * A unique identifier for this result category.
   */
  id: string;
  /**
   * A human readable description for the result category. Can be localized.
   */
  description: string;
  /**
   * A list of results for this category.
   */
  results: IResult[];
}

/**
 * Represents a single result.
 */
export interface IResult {
  /**
   * A unique identifier for this result.
   */
  id: string;
  /**
   * A human readable text for this result. Can be localized.
   */
  text: string;
  /**
   * A logic expression yielding true or false. The first result in the result category yielding true will be
   * used as result. If no result evaluates to true, no result is shown for this category.
   */
  value: LogicExpression; // TODO: Maybe we can come up with a better name than value.
}

/**
 * Meta-Information for a questionaire.
 */
export interface IQuestionnaireMeta {
  title: string;
  description?: string;
  author: string;
  publisher?: string;
  /**
   * Language of this questionaire, as ISO 639-1 code.
   * Note that further languages can be defined in external lookup files.
   */
  language: string;
  /**
   * Creation date as ISO 8601 string
   */
  creationDate: string;
  /**
   * Expiration date as ISO 8601 string
   */
  experiationDate?: string;
  /**
   * Region restriction (e.g. regions in which this questionaire is valid) as list of ISO 3166 ids.
   */
  regions?: string[];
}

/**
 * The questionaire.
 */
export interface IQuestionnaire {
  /**
   * Unique, assigned identifier. Machine friendly.
   */
  id: string;
  /**
   * File format/api version in semver.
   */
  schemaVersion: string;
  /**
   * Version of this question in semver.
   */
  version: string;
  /**
   * Meta-Information.
   */
  meta: IQuestionnaireMeta;
  /**
   * All questions, shown one after another, in order.
   */
  questions: IQuestion[];
  /**
   * All variables, refreshed after each update to any answer.
   */
  variables: IVariable[];
  /**
   * All result categories. When all questions are answered,
   * the result for each result category is computed.
   */
  resultCategories: IResultCategory[];
}
