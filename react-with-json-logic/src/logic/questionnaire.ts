// This file showcases a basic reference implementation.
import jsonLogic from "json-logic-js";

import {
  IQuestion,
  QuestionType,
  IQuestionnaire,
  IQuestionnaireMeta,
  IVariable,
  IResultCategory,
} from "./schema";
import { LogicConstant, LogicExpression } from "./logic";

class Question implements IQuestion {
  id: string;
  type: QuestionType;
  text: string;
  skipIf?: LogicExpression;

  constructor(question: IQuestion) {
    this.id = question.id;
    this.type = question.type;
    this.text = question.text;
    this.skipIf = question.skipIf;
  }

  public check(data: {}): boolean {
    if (this.skipIf) {
      return !jsonLogic.apply(this.skipIf, data);
    } else {
      return true;
    }
  }
}

export class Questionnaire implements IQuestionnaire {
  meta: IQuestionnaireMeta;
  questions: Question[] = [];
  variables: IVariable[] = [];
  answeredQuestions: string[] = [];
  resultCategories: IResultCategory[] = [];
  data: {} = {};

  public setQuestionnaire(newQuestionnaire: IQuestionnaire) {
    this.meta = newQuestionnaire.meta;
    this.questions = newQuestionnaire.questions.map(
      (question) => new Question(question)
    );
    this.variables = newQuestionnaire.variables;
    this.resultCategories = newQuestionnaire.resultCategories;
    this.answeredQuestions = [];
  }

  public nextQuestion(): null | Question {
    // start always from first question, because the guard might evaluate to true
    // if later questions were answered.
    for (const question of this.questions) {
      // skip if question was answered previously
      if (this.answeredQuestions.indexOf(question.id) > -1) {
        continue;
      }

      // ask only if should be asked
      const guardCheck = question.check(this);
      if (!guardCheck) {
        continue;
      }

      return question;
    }
    return null;
  }

  public setAnswer(questionId: string, answer: LogicConstant) {
    this.answeredQuestions.push(questionId);
    this.data[questionId] = answer;
    this.updateComputableVariables();
  }

  public updateComputableVariables() {
    this.data["g_now"] = new Date().getDay();

    this.variables.forEach((variable) => {
      try {
        this.data[variable.id] = jsonLogic.apply(variable.value, this.data);
      } catch (e) {}
    });
  }
}
