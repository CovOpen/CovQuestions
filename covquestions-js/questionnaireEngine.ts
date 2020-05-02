// @ts-ignore
import jsonLogic from "json-logic-js";

import {
  AnyQuestion,
  NumericOption,
  Option,
  Questionnaire,
  QuestionType,
  ResultCategory,
  Variable,
  LogicExpression,
} from "./models/questionnaire";
import { Primitive } from "./primitive";

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
    if (
      question.type === "select" ||
      question.type === "multiselect"
    ) {
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

type QuestionResponse = {
  value: Primitive | Array<Primitive> | undefined;
  selectedCount?: number;
  count?: number;
  unselectedCount?: number;
  option?: { [optionId: string]: { selected: boolean } };
};

export class QuestionnaireEngine {
  private readonly questions: Question[] = [];
  private variables: Variable[] = [];
  private resultCategories: ResultCategory[] = [];
  private data: { [key: string]: QuestionResponse } = {};
  private currentQuestionIndex = -1;

  constructor(newQuestionnaire: Questionnaire) {
    this.questions = newQuestionnaire.questions.map(
      (question) => new Question(question)
    );
    this.variables = newQuestionnaire.variables;
    this.resultCategories = newQuestionnaire.resultCategories;
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
    let answer: QuestionResponse = { value };

    let question = this.getQuestionById(questionId);
    if (question !== undefined) {
      switch (question.type) {
        case "multiselect":
          let array = (value || []) as Array<Primitive>;
          answer.selectedCount = array !== undefined ? array.length : 0;
          answer.count = question.options?.length || 0;
          answer.unselectedCount = answer.count - answer.selectedCount;
          answer.option = {};
          for (const option of question.options || []) {
            answer.option[option.value] = {
              selected:
                array !== undefined ? array.indexOf(option.value) > -1 : false,
            };
          }
          break;
      }
    }
    this.data[questionId] = answer;
    this.updateComputableVariables();
  }

  private getQuestionById(questionId: string): Question | undefined {
    return this.questions.find((question) => question.id === questionId);
  }

  private updateComputableVariables() {
    this.data["g_now"] = { value: Math.round(Date.now() / 1000) };

    this.variables.forEach((variable) => {
      try {
        this.data[variable.id] = {
          value: jsonLogic.apply(variable.expression, this.data),
        };
      } catch (e) {}
    });
  }

  public getDataObjectForDeveloping(): {} {
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
