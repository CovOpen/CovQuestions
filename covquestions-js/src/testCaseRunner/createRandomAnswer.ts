import { Option, Question, TestCase } from "../models/Questionnaire.generated";
import { dateInSecondsTimestamp } from "./testCaseRunner";

export function createRandomAnswer(question: Question, testCase: TestCase) {
  const percentageOfOptionalQuestionsThatAreNotAnswered = 0.2;
  if (question.optional && Math.random() < percentageOfOptionalQuestionsThatAreNotAnswered) {
    return undefined;
  }

  switch (question.type) {
    case "select":
      return getRandomElementFromArray(question.options!).value;
    case "multiselect":
      return getRandomOptionValues(question.options!);
    case "date":
      return getRandomDate(testCase.options !== undefined ? testCase.options.fillInDate : undefined);
    case "boolean":
      return Math.random() < 0.5;
    case "number":
      return getRandomInRange(
        question.numericOptions !== undefined && question.numericOptions.min !== undefined
          ? question.numericOptions.min
          : 0,
        question.numericOptions !== undefined && question.numericOptions.max !== undefined
          ? question.numericOptions.max
          : 150,
        question.numericOptions !== undefined && question.numericOptions.step !== undefined
          ? question.numericOptions.step
          : 1
      );
    case "text":
      return Math.random().toString(36).substring(2);
  }
}

function getRandomElementFromArray(array: any[]): any {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomOptionValues(options: Option[]) {
  return options.reduce(
    (selectedValues: string[], option) => (Math.random() < 0.5 ? [...selectedValues, option.value] : selectedValues),
    []
  );
}

function getRandomDate(fillInDate?: string) {
  const executionDate = fillInDate !== undefined ? dateInSecondsTimestamp(fillInDate) : Date.now() / 1000;
  const daysBeforeOrAfterExecution = getRandomInRange(-30, 30);
  return Math.round(executionDate + daysBeforeOrAfterExecution * 24 * 3600);
}

function getRandomInRange(min: number, max: number, step: number = 1) {
  const numberInRange = Math.random() * (max - min) + min;
  return Math.round(numberInRange / step) * step;
}
