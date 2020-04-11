// This file showcases a basic reference implementation.
import jsonLogic from "json-logic-js";

import { IOption, IQuestion, IQuestionnaire, IResultCategory, IVariable, QuestionType } from "./schema";
import { LogicConstant, LogicExpression } from "./logic";

export type Result = {
  resultCategory: { id: string; description: string };
  result: { id: string; text: string };
};

export class Question implements IQuestion {
  id: string;
  type: QuestionType;
  text: string;
  options?: IOption[];
  enableWhen?: LogicExpression;
  optional?: boolean;

  constructor(question: IQuestion) {
    this.id = question.id;
    this.type = question.type;
    this.text = question.text;
    this.options = question.options;
    this.enableWhen = question.enableWhen;
    this.optional = question.optional;
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
    if (this.type === QuestionType.Multiselect) {
      return true;
    }
    return false;
  }
}

export class Questionnaire {
  private readonly questions: Question[] = [];
  private variables: IVariable[] = [];
  private resultCategories: IResultCategory[] = [];
  private data: {} = {};
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

  public setAnswer(questionId: string, answer: LogicConstant) {
    this.data[questionId] = {};
    this.data[questionId].value = answer;
    this.updateComputableVariables();
  }

  public hasAnswer(questionId: string): boolean {
    return this.data[questionId] != null && this.data[questionId].value != null;
  }

  private updateComputableVariables() {
    this.data["g_now"] = {};
    this.data["g_now"].value = Math.round(Date.now() / 1000);

    this.variables.forEach((variable) => {
      try {
        this.data[variable.id] = {};
        this.data[variable.id].value = jsonLogic.apply(variable.value, this.data);
      } catch (e) {}
    });
  }

  public getDataObjectForDeveloping(): {} {
    return this.data;
  }

  public getResults(): Result[] {
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
