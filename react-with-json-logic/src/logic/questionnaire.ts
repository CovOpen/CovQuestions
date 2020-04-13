// @ts-ignore
import jsonLogic from "json-logic-js";

import { INumericOption, IOption, IQuestion, IQuestionnaire, IResultCategory, IVariable, QuestionType } from "./schema";
import { LogicExpression } from "./logic";
import { Primitive } from "../Primitive";

export type Result = {
  resultCategory: { id: string; description: string };
  result: { id: string; text: string };
};

export class Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: IOption[];
  numericOption?: INumericOption;
  enableWhen?: LogicExpression;
  optional?: boolean;

  constructor(question: IQuestion) {
    this.id = question.id;
    this.type = question.type;
    this.text = question.text;
    this.enableWhen = question.enableWhen;
    this.optional = question.optional;
    if (question.type === QuestionType.Select || question.type === QuestionType.Multiselect) {
      this.options = question.options;
    }
    if (question.type === QuestionType.Number) {
      this.numericOption = question.numericOptions;
    }
  }

  public check(data: {}): boolean {
    if (this.enableWhen !== undefined) {
      return jsonLogic.apply(this.enableWhen, data);
    } else {
      return true;
    }
  }

  public isOptional(): boolean {
    if (this.optional != null) {
      return this.optional;
    }
    return this.type === QuestionType.Multiselect;
  }
}

type QuestionRespose = {
  value: Primitive | Array<Primitive> | undefined;
  selectedCount?: number;
  count?: number;
  unselectedCount?: number;
  option?: { [optionId: string]: { selected: boolean } };
};

export class Questionnaire {
  private readonly questions: Question[] = [];
  private variables: IVariable[] = [];
  private resultCategories: IResultCategory[] = [];
  private data: { [key: string]: QuestionRespose } = {};
  private currentQuestionIndex = -1;

  constructor(newQuestionnaire: IQuestionnaire) {
    this.questions = newQuestionnaire.questions.map((question) => new Question(question));
    this.variables = newQuestionnaire.variables;
    this.resultCategories = newQuestionnaire.resultCategories;
  }

  public nextQuestion(): Question | undefined {
    const indexOfNextQuestion = this.questions.findIndex(
      (question, index) => index > this.currentQuestionIndex && question.check(this.data)
    );

    if (indexOfNextQuestion > -1) {
      this.currentQuestionIndex = indexOfNextQuestion;
      return this.questions[indexOfNextQuestion];
    }

    return undefined;
  }

  public setAnswer(questionId: string, value: Primitive | Array<Primitive> | undefined) {
    let answer: QuestionRespose = { value };
    let question = this.getQuestionById(questionId);
    if (question !== undefined) {
      switch (question.type) {
        case QuestionType.Multiselect:
          let array = value as Array<Primitive>;
          answer.selectedCount = array !== undefined ? array.length : 0;
          answer.count = question.options?.length ?? 0;
          answer.unselectedCount = answer.count - answer.selectedCount;
          answer.option = {};
          for (const option of question.options ?? []) {
            answer.option[option.value] = {
              selected: array !== undefined ? array.indexOf(option.value) > -1 : false,
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
        this.data[variable.id] = { value: jsonLogic.apply(variable.value, this.data) };
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
        jsonLogic.apply(possibleResult.value, this.data)
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
