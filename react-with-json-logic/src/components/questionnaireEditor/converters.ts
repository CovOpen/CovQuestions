import { Expression } from "../../logic-parser/parser";
import { LogicExpression } from "covquestions-js/models/Questionnaire.generated";
import { Questionnaire } from "../../models/questionnaire";

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
      enableWhenString: convertLogicExpressionToString(question.enableWhenExpression),
    })),
    resultCategories: questionnaire.resultCategories.map((resultCategory) => ({
      ...resultCategory,
      results: resultCategory.results.map((result) => ({
        ...result,
        valueString: convertLogicExpressionToString(result.expression),
      })),
    })),
    variables: questionnaire.variables.map((variable) => ({
      ...variable,
      valueString: convertLogicExpressionToString(variable.expression),
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
    resultCategories: questionnaire.resultCategories.map((resultCategory) => ({
      ...resultCategory,
      results: resultCategory.results.map((result) => {
        const { valueString, ...rest } = result;
        return rest;
      }),
    })),
    variables: questionnaire.variables.map((variable) => {
      const { valueString, ...rest } = variable;
      return rest;
    }),
  };
}
