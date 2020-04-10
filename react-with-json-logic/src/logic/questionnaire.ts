// This file showcases a basic reference implementation.
import jsonLogic from "json-logic-js";

import {
  IOption,
  IQuestion,
  IQuestionnaire,
  IQuestionnaireMeta,
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

export class Questionnaire implements IQuestionnaire {
  id: string;
  schemaVersion: string;
  version: string;
  meta: IQuestionnaireMeta;
  questions: Question[] = [];
  variables: IVariable[] = [];
  answeredQuestions: string[] = [];
  resultCategories: IResultCategory[] = [];
  data: {} = {};

  public setQuestionnaire(newQuestionnaire: IQuestionnaire) {
    this.id = newQuestionnaire.id;
    this.schemaVersion = newQuestionnaire.schemaVersion;
    this.version = newQuestionnaire.version;
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
      const questionIsEnabled = question.check(this.data);
      if (questionIsEnabled) {
        return question;
      }
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
