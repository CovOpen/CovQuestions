import * as jsonLogic from "json-logic-js";
import deepEqual from "fast-deep-equal";

import {
  LogicExpression,
  Question,
  Questionnaire,
  QuestionWithOptions,
  ResultCategory,
  Variable,
} from "./models/Questionnaire.generated";
import { convertToPrimitiveArray, Primitive } from "./primitive";
import printf from "printf";
import dayjs from "dayjs";

export type Result = {
  resultCategory: { id: string; description: string };
  result: { id: string; text: string };
};

export type QuestionnaireResult = {
  questionnaireId: string;
  questionnaireVersion: number;
  results: Result[];
  answers: { [answerId: string]: RawAnswer };
  exports: QuestionnaireExport[];
};

export type QuestionnaireExport = {
  /**
   * Id of the export
   * @example covapp - for QR Code of the Charite
   */
  id: string;
  /**
   * Map of export variables
   */
  mapping: { [key: string]: string };
};

type ScoreResponse = {
  [k: string]: number;
};

type OptionResponse = { [optionId: string]: boolean };

type AnswerFromOptions = {
  selected_count: number;
  count: number;
  unselected_count: number;
  option: OptionResponse;
  score: ScoreResponse;
};

type DataObject = { [key: string]: DataObjectEntry };
type DataObjectEntry = AnswerFromOptions | RawAnswer | ScoreResponse;

type GivenAnswer = {
  questionId: string;
  rawAnswer: RawAnswer;
};

export type RawAnswer = Primitive | Primitive[] | undefined;

type AnswersPersistence = {
  answers: GivenAnswer[];
  version: number;
  timeOfExecution?: number;
};

export class QuestionnaireEngine {
  private readonly questionnaire: Questionnaire;
  private readonly questions: Question[] = [];
  private variables: Variable[] = [];
  private resultCategories: ResultCategory[] = [];
  private data: DataObject = {};
  private readonly timeOfExecution?: number;
  private givenAnswers: GivenAnswer[] = [];

  constructor(newQuestionnaire: Questionnaire, timeOfExecution?: number) {
    this.questionnaire = newQuestionnaire;
    this.questions = newQuestionnaire.questions;
    this.variables = newQuestionnaire.variables;
    this.resultCategories = newQuestionnaire.resultCategories;
    this.timeOfExecution = timeOfExecution;

    this.setAdditionalJsonLogicOperators();
  }

  /**
   *
   * @returns The next Question or `undefined` if there is none.
   */

  public nextQuestion(): Question | undefined {
    const indexOfNextQuestion = this.questions.findIndex((question, index) => {
      const isAfterCurrentQuestion = index > this.getQuestionIndex(this.getCurrentQuestionId());
      const isEnabled = isQuestionEnabled(question, this.data);
      return isAfterCurrentQuestion && isEnabled;
    });

    if (indexOfNextQuestion > -1) {
      return this.questions[indexOfNextQuestion];
    }

    return undefined;
  }

  public previousQuestion(currentQuestionId: string): { question: Question; answer?: RawAnswer } {
    this.removeAnswersStartingFrom(currentQuestionId);
    const previousAnswer = this.givenAnswers.pop();
    this.recreateDataObject();

    const previousQuestion = this.nextQuestion() ?? this.questions[0]!;

    if (previousQuestion.id === previousAnswer?.questionId) {
      return { question: previousQuestion, answer: previousAnswer.rawAnswer };
    }
    return { question: previousQuestion };
  }

  public getAnswersPersistence(): AnswersPersistence {
    return { answers: this.givenAnswers, version: this.questionnaire.version };
  }

  public setAnswersPersistence(answersPersistence: AnswersPersistence) {
    this.givenAnswers = answersPersistence.answers;
    this.recreateDataObject();
  }

  public setAnswer(questionId: string, rawAnswer: RawAnswer) {
    const question = this.getQuestionById(questionId);
    if (question === undefined) {
      throw new Error(`You cannot set the answer to a question that does not exist. QuestionId: ${questionId}`);
    }

    if (!question.optional && rawAnswer === undefined) {
      throw new Error(`This question is not optional: ${questionId}`);
    }

    this.removeAnswersStartingFrom(questionId);

    this.givenAnswers.push({
      questionId: questionId,
      rawAnswer,
    });

    this.recreateDataObject();
  }

  private removeAnswersStartingFrom(questionId: string) {
    const indexOfAnswer = this.givenAnswers.findIndex((answer) => answer.questionId === questionId);

    if (indexOfAnswer > -1) {
      this.givenAnswers = this.givenAnswers.slice(0, indexOfAnswer);
    }
  }

  public getProgress(): number {
    const currentId = this.getCurrentQuestionId();
    if (currentId != undefined) {
      const nextQuestion = this.getNextQuestion(currentId);
      if (nextQuestion) {
        return (this.getQuestionIndex(currentId) + 1) / this.questions.length;
      } else {
        return 1;
      }
    }
    return 0;
  }

  getNextQuestion(currentQuestionId: string): Question | undefined {
    const nextPossibleQuestion = this.questions[this.getQuestionIndex(currentQuestionId) + 1];
    if (nextPossibleQuestion != undefined) {
      if (isQuestionEnabled(nextPossibleQuestion, this.data)) {
        return nextPossibleQuestion;
      } else {
        return this.getNextQuestion(nextPossibleQuestion.id);
      }
    }
    return undefined;
  }

  private getQuestionIndex(questionId: string | undefined): number {
    return this.questions.findIndex(({ id }) => id === questionId);
  }

  private getCurrentQuestionId(): string | undefined {
    const lastAnswer = this.givenAnswers[this.givenAnswers.length - 1];
    return lastAnswer?.questionId;
  }

  private processAnswerWithOptions(rawAnswer: RawAnswer, question: QuestionWithOptions): AnswerFromOptions {
    const valueAsArray = convertToPrimitiveArray(rawAnswer);

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

  private mergeScores(scores1?: ScoreResponse, scores2?: ScoreResponse): ScoreResponse {
    const combinedScores = scores1 ?? {};
    Object.entries(scores2 ?? {}).forEach(([scoreId, score]) => {
      combinedScores[scoreId] = (combinedScores[scoreId] ?? 0) + score;
    });
    return combinedScores;
  }

  private getQuestionById(questionId: string): Question | undefined {
    return this.questions.find((question) => question.id === questionId);
  }

  private recreateDataObject() {
    const data: DataObject = {};
    data["now"] = Math.round(this.timeOfExecution || Date.now() / 1000);

    const answersFromOptionQuestions: AnswerFromOptions[] = [];

    this.givenAnswers.forEach(({ questionId, rawAnswer }) => {
      const question = this.questions.find(({ id }) => id === questionId);

      if (question?.type === "multiselect" || question?.type === "select") {
        const processedAnswer = this.processAnswerWithOptions(rawAnswer, question);
        answersFromOptionQuestions.push(processedAnswer);
        data[questionId] = processedAnswer;
      } else {
        data[questionId] = rawAnswer;
      }
    });

    data.score = answersFromOptionQuestions.reduce<ScoreResponse>(
      (prev, curr) => this.mergeScores(prev, curr.score),
      {}
    );

    this.data = this.calculateVariables(data);
  }

  private calculateVariables(data: DataObject): DataObject {
    let lastData: DataObject;
    let newData: DataObject = { ...data };
    let counter = 0;

    do {
      lastData = { ...newData };
      this.variables.forEach((variable) => {
        try {
          newData[variable.id] = jsonLogic.apply(variable.expression, newData);
        } catch (e) {}
      });
      counter = counter + 1;
    } while (!deepEqual(lastData, newData) && counter <= this.variables.length);

    return newData;
  }

  public getVariables(): { [key: string]: any } {
    this.recreateDataObject();
    return this.variables.reduce((aggregate, { id }) => {
      aggregate[id] = this.data[id];
      return aggregate;
    }, {} as { [key: string]: any });
  }

  /**
   * SHOULD NOT BE USED
   * Exposes the Internal State for debugging purposes.
   * @returns Internal State
   */
  public getDataObjectForDeveloping(): any {
    return this.data;
  }

  public getCategoryResults(): Result[] {
    this.recreateDataObject();
    const data = this.data;
    const results = this.resultCategories.map((resultCategory) => {
      const resultInCategory = resultCategory.results.find((possibleResult) =>
        jsonLogic.apply(possibleResult.expression, data)
      );
      if (resultInCategory !== undefined) {
        return {
          resultCategory: {
            id: resultCategory.id,
            description: resultCategory.description,
          },
          result: {
            id: resultInCategory.id,
            text: printf(resultInCategory.text, data),
          },
        };
      } else {
        return undefined;
      }
    });
    return results.filter(notUndefined);
  }

  public getResults(): QuestionnaireResult {
    return {
      answers: this.givenAnswers.reduce((aggregate, current) => {
        aggregate[current.questionId] = current.rawAnswer;
        return aggregate;
      }, {} as { [key: string]: RawAnswer }),
      exports: [
        // This is just for now, extra Exports should be implemented
        {
          id: "covapp_qr",
          mapping: this.variables.reduce((aggregator, variable) => {
            if (variable.id.startsWith("qr_")) {
              aggregator[variable.id.substring(3)] = jsonLogic.apply(variable.expression, this.data);
            }
            return aggregator;
          }, {} as { [key: string]: string }),
        },
      ],
      questionnaireId: this.questionnaire.id,
      questionnaireVersion: this.questionnaire.version,
      results: this.getCategoryResults(),
    };
  }

  private setAdditionalJsonLogicOperators() {
    function convertToDateString(timestamp?: LogicExpression, dateFormat?: LogicExpression): string | null {
      if (!timestamp || !dateFormat) {
        return null;
      }
      const timestampInMilliseconds = parseInt(timestamp.toString()) * 1000;
      return dayjs(timestampInMilliseconds).format(dateFormat.toString());
    }

    jsonLogic.add_operation("convert_to_date_string", convertToDateString);
    jsonLogic.add_operation("round", Math.round);
    jsonLogic.add_operation("log10", Math.log10);
  }
}

function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

function isQuestionEnabled(question: Question, data: DataObject): boolean {
  return question.enableWhenExpression === undefined || jsonLogic.apply(question.enableWhenExpression, data);
}
