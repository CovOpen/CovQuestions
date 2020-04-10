// This file showcases a basic reference implementation.
import jsonLogic from "json-logic-js";

import {
  IOption,
  IQuestion,
  IQuestionnaire,
  IResultCategory,
  IVariable,
  QuestionType,
} from "./schema";
import { LogicConstant, LogicExpression } from "./logic";

class Question implements IQuestion {
  id: string;
  type: QuestionType;
  text: string;
  options?: IOption[];
  enableWhen?: LogicExpression;

  constructor(question: IQuestion) {
    this.id = question.id;
    this.type = question.type;
    this.text = question.text;
    this.options = question.options;
    this.enableWhen = question.enableWhen;
  }

  public check(data: {}): boolean {
    if (this.enableWhen !== undefined) {
      return jsonLogic.apply(this.enableWhen, data);
    } else {
      return true;
    }
  }
}

export class Questionnaire {
  private readonly questions: Question[] = [];
  private variables: IVariable[] = [];
  private answeredQuestions: string[] = [];
  private resultCategories: IResultCategory[] = [];
  private data: {} = {};
  private currentQuestionIndex = -1;

  constructor(newQuestionnaire: IQuestionnaire) {
    this.questions = newQuestionnaire.questions.map(
      (question) => new Question(question)
    );
    this.variables = newQuestionnaire.variables;
    this.resultCategories = newQuestionnaire.resultCategories;
  }

  public nextQuestion(): null | Question {
    const indexOfNextQuestion = this.questions.findIndex(
      (question, index) =>
        index > this.currentQuestionIndex && question.check(this.data)
    );

    if (indexOfNextQuestion > -1) {
      this.currentQuestionIndex = indexOfNextQuestion;
      return this.questions[indexOfNextQuestion];
    }

    return null;
  }

  public setAnswer(questionId: string, answer: LogicConstant) {
    this.answeredQuestions.push(questionId);
    this.data[questionId] = {};
    this.data[questionId].value = answer;
    this.updateComputableVariables();
  }

  public updateComputableVariables() {
    this.data["g_now"] = {};
    this.data["g_now"].value = Math.round(Date.now() / 1000);

    this.variables.forEach((variable) => {
      try {
        this.data[variable.id] = {};
        this.data[variable.id].value = jsonLogic.apply(
          variable.value,
          this.data
        );
      } catch (e) {}
    });
  }

  public getDataObjectForDeveloping(): {} {
    return this.data;
  }
}
