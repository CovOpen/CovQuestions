import { LogicExpression } from "../../models/LogicExpression";
import { Expression } from "../../logic-parser/parser";

export function convertLogicExpressionToString(value?: LogicExpression) {
  return JSON.stringify(value, undefined, 2) ?? "";
}

export function convertStringToLogicExpression(value: string): LogicExpression {
  if (value === "") {
    return undefined!;
  }
  try {
    return JSON.parse(value);
  } catch (e) {}

  try {
    return new Expression(value).toJSONLogic();
  } catch (e) {}

  return undefined!;
}
