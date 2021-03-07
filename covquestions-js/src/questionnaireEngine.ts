import * as jsonLogic from "json-logic-js";

import {
  AnyQuestion,
  LogicExpression,
  NumericOption,
  Option,
  Questionnaire,
  QuestionType,
  ResultCategory,
  Variable,
} from "./models/Questionnaire.generated";
import { convertToPrimitiveArray, Primitive } from "./primitive";

export type Result = {
  resultCategory: { id: string; description: string };
  result: { id: string; text: string };
};

export class Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: Option[];
  numericOption?: NumericOption;
  enableWhenExpression?: LogicExpression;
  optional?: boolean;

  constructor(question: AnyQuestion) {
    this.id = question.id;
    this.type = question.type;
    this.text = question.text;
    this.enableWhenExpression = question.enableWhenExpression;
    this.optional = question.optional;
    if (question.type === "select" || question.type === "multiselect") {
      this.options = question.options;
    }
    if (question.type === "number") {
      this.numericOption = question.numericOptions;
    }
  }

  public check(data: {}): boolean {
    if (this.enableWhenExpression !== undefined) {
      return jsonLogic.apply(this.enableWhenExpression, data);
    } else {
      return true;
    }
  }

  public isOptional(): boolean {
    return this.optional === true;
  }
}

type ScoreResponse = {
  [k: string]: number;
};

type OptionResponse = { [optionId: string]: boolean };

type ResponseFromOptions = {
  selected_count: number;
  count: number;
  unselected_count: number;
  option: OptionResponse;
  score: ScoreResponse;
};

function isResponseFromOptions(value: unknown): value is ResponseFromOptions {
  if (value === undefined || typeof value !== "object" || value === null) {
    return false;
  }

  return (
    value.hasOwnProperty("score") &&
    value.hasOwnProperty("count") &&
    value.hasOwnProperty("selected_count") &&
    value.hasOwnProperty("unselected_count") &&
    value.hasOwnProperty("option")
  );
}

type DataObjectEntry =
  | ResponseFromOptions
  | Primitive
  | Array<Primitive>
  | ScoreResponse
  | undefined;

export class QuestionnaireEngine {
  private readonly questions: Question[] = [];
  private variables: Variable[] = [];
  private resultCategories: ResultCategory[] = [];
  private data: { [key: string]: DataObjectEntry } = {};
  private currentQuestionIndex = -1;
  private readonly timeOfExecution?: number;

  constructor(newQuestionnaire: Questionnaire, timeOfExecution?: number) {
    this.questions = newQuestionnaire.questions.map(
      (question) => new Question(question)
    );
    this.variables = newQuestionnaire.variables;
    this.resultCategories = newQuestionnaire.resultCategories;
    this.timeOfExecution = timeOfExecution;
  }

  public nextQuestion(): Question | undefined {
    const indexOfNextQuestion = this.questions.findIndex(
      (question, index) =>
        index > this.currentQuestionIndex && question.check(this.data)
    );

    if (indexOfNextQuestion > -1) {
      this.currentQuestionIndex = indexOfNextQuestion;
      return this.questions[indexOfNextQuestion];
    }

    return undefined;
  }

  public setAnswer(
    questionId: string,
    value: Primitive | Array<Primitive> | undefined
  ) {
    const question = this.getQuestionById(questionId);
    if (question === undefined) {
      throw new Error(
        `You cannot set the answer to a question that does not exist. QuestionId: ${questionId}`
      );
    }

    if (!question.isOptional() && value === undefined) {
      throw new Error(`This question is not optional: ${questionId}`);
    }

    let answer: DataObjectEntry;

    if (question.type === "multiselect" || question.type === "select") {
      answer = this.processAnswerWithOptions(value, question);
    } else {
      answer = value;
    }

    this.data[questionId] = answer;
    this.updateComputableVariables();
  }

  public getProgress(): number {
    return (this.currentQuestionIndex + 1) / this.questions.length;
  }

  private processAnswerWithOptions(
    value: Primitive | Array<Primitive> | undefined,
    question: Question
  ): ResponseFromOptions {
    const valueAsArray = convertToPrimitiveArray(value);

    const count = question.options !== undefined ? question.options.length : 0;
    const selected_count = valueAsArray.length;
    const unselected_count = count - selected_count;

    const optionResponse: OptionResponse = {};
    let score: ScoreResponse = {};
    for (const option of question.options || []) {
      const isSelected = valueAsArray.indexOf(option.value) > -1;
      optionResponse[option.value] = isSelected;
      if (isSelected) {
        score = this.mergeScores(score, option.scores);
      }
    }

    return {
      count,
      selected_count,
      unselected_count,
      option: optionResponse,
      score,
    };
  }

  private mergeScores(
    scores1?: ScoreResponse,
    scores2?: ScoreResponse
  ): ScoreResponse {
    const combinedScores = scores1 ?? {};
    Object.entries(scores2 ?? {}).forEach(([scoreId, score]) => {
      combinedScores[scoreId] = (combinedScores[scoreId] ?? 0) + score;
    });
    return combinedScores;
  }

  private getQuestionById(questionId: string): Question | undefined {
    return this.questions.find((question) => question.id === questionId);
  }

  private updateComputableVariables() {
    this.data["now"] = Math.round(this.timeOfExecution || Date.now() / 1000);

    const givenOptionResponses = this.questions
      .map(({ id }) => this.data[id])
      .filter((it) => isResponseFromOptions(it)) as ResponseFromOptions[];
    this.data.score = givenOptionResponses.reduce<ScoreResponse>(
      (prev, curr) => this.mergeScores(prev, curr.score),
      {}
    );

    this.variables.forEach((variable) => {
      try {
        this.data[variable.id] = jsonLogic.apply(
          variable.expression,
          this.data
        );
      } catch (e) {}
    });
  }

  public getDataObjectForDeveloping(): any {
    return this.data;
  }

  public getResults(): Result[] {
    this.updateComputableVariables();
    const results = this.resultCategories.map((resultCategory) => {
      const resultInCategory = resultCategory.results.find((possibleResult) =>
        jsonLogic.apply(possibleResult.expression, this.data)
      );
      if (resultInCategory !== undefined) {
        return {
          resultCategory: {
            id: resultCategory.id,
            description: resultCategory.description,
          },
          result: { id: resultInCategory.id, text: resultInCategory.text },
        };
      } else {
        return undefined;
      }
    });
    return results.filter(notUndefined);
  }
}

function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}
