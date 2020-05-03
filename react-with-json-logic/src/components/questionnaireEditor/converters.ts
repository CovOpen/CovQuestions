import { Expression } from "../../logic-parser/parser";
import { LogicExpression, Questionnaire } from "covquestions-js/models/Questionnaire.generated";
import { EditorQuestionnaire } from "../../models/editorQuestionnaire";

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

export function addStringRepresentationToQuestionnaire(questionnaire: Questionnaire): EditorQuestionnaire {
  return {
    ...questionnaire,
    questions: questionnaire.questions.map((question) => ({
      ...question,
      enableWhenExpressionString: convertLogicExpressionToString(question.enableWhenExpression),
    })),
    resultCategories: questionnaire.resultCategories.map((resultCategory) => ({
      ...resultCategory,
      results: resultCategory.results.map((result) => ({
        ...result,
        expressionString: convertLogicExpressionToString(result.expression),
      })),
    })),
    variables: questionnaire.variables.map((variable) => ({
      ...variable,
      expressionString: convertLogicExpressionToString(variable.expression),
    })),
  };
}

export function removeStringRepresentationFromQuestionnaire(questionnaire: EditorQuestionnaire): Questionnaire {
  return {
    ...questionnaire,
    questions: questionnaire.questions.map((question) => {
      const { enableWhenExpressionString, ...rest } = question;
      return rest;
    }),
    resultCategories: questionnaire.resultCategories.map((resultCategory) => ({
      ...resultCategory,
      results: resultCategory.results.map((result) => {
        const { expressionString, ...rest } = result;
        return rest;
      }),
    })),
    variables: questionnaire.variables.map((variable) => {
      const { expressionString, ...rest } = variable;
      return rest;
    }),
  };
}
