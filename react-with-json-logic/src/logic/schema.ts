// LogicExpression refers to the JSONLogic standard.
import { LogicExpression } from "./logic";

/*
 * This module defines a schema for questionaire and result calulation logic.
 */

/**
 * Type of a question, essentially defines the result type.
 */
export enum QuestionType {
  Select = "Select",
  Multiselect = "Multiselect",
  Number = "Number",
  Boolean = "Boolean",
  Date = "Date",
  Text = "Text",
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
}

/**
 * Represents a question.
 */
export interface IQuestion {
  /**
   * Unique id for referring this question in logic expressions.
   */
  id: string;
  /**
   * Type of the question.
   */
  type: QuestionType;
  /**
   * Human-readable question text, can be localized.
   */
  text: string;
  /**
   * Answer options for Select/Multiselect questions.
   */
  options?: IOption[];
  /**
   * Boolean indicating whether the question is optional or not.
   */
  optional?: boolean;
  /**
   * Logic expression to decide whether the question should be displayed or not.
   */
  skipIf?: LogicExpression;
}

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
  text: string;
  /**
   * A logic expression for computing the result. Either yields the ID of one of the results
   * in this category. If the expression yields a result that does not correspond to a result ID, no result should be shown.
   */
  value: LogicExpression;
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
}

/**
 * Meta-Information for a questionaire.
 */
export interface IQuestionnaireMeta {
  name: string;
  version: string;
  author: string;
  languages: string[];
}

/**
 * The questionaire.
 */
export interface IQuestionnaire {
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
