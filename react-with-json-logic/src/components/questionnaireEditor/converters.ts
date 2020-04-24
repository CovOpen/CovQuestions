import { LogicExpression } from "../../models/LogicExpression";
import { Expression } from "../../logic-parser/parser";
import { Questionnaire } from "../../models/Questionnaire";

export function convertLogicExpressionToString(value?: LogicExpression) {
  return JSON.stringify(value, undefined, 2) ?? "";
}

export function convertStringToLogicExpression(value?: string): LogicExpression | undefined {
  if (value === undefined || value === "") {
    return undefined;
  }
  try {
    return JSON.parse(value);
  } catch (e) {}

  try {
    return new Expression(value).toJSONLogic();
  } catch (e) {}

  return undefined;
}

export function addStringRepresentationToQuestionnaire(questionnaire: Questionnaire): Questionnaire {
  return {
    ...questionnaire,
    questions: questionnaire.questions.map((question) => ({
      ...question,
      enableWhenString: convertLogicExpressionToString(question.enableWhen),
    })),
  };
}

export function removeStringRepresentationFromQuestionnaire(questionnaire: Questionnaire): Questionnaire {
  return {
    ...questionnaire,
    questions: questionnaire.questions.map((question) => {
      const { enableWhenString, ...rest } = question;
      return rest;
    }),
  };
}
