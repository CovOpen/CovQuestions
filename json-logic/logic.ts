// Mini typings for JSON Logic, for our convenience
// Feel free to extend according to the JSON Logic doc: http://jsonlogic.com/operations.html
export type LogicExpression = LogicOperator | LogicVariable | LogicConstant;
export type LogicVariable = { var: string };
export type LogicConstant = number | string | boolean;
export type LogicOperator =
  | LogicIf
  | LogicReduce
  | LogicSome
  | LogicEquals
  | LogicGreaterEqual
  | LogicNot
  | LogicLessEqual
  | LogicPlus
  | LogicMinus
  | LogicAnd
  | LogicOr
  | LogicIn
  | LogicGreater
  | LogicLess;

export type LogicIf = { if: [LogicExpression, LogicExpression, LogicExpression] };
export type LogicReduce = { reduce: [LogicExpression, LogicExpression, LogicExpression] };
export type LogicSome = { some: [LogicExpression, LogicExpression] };
export type LogicIn = { in: [LogicExpression, LogicExpression[]] };

// Unary Operands.
export type LogicNot = { "!": LogicExpression | LogicExpression[] };

// Binary Operands.
export type LogicMinus = { "-": [LogicExpression, LogicExpression] };
export type LogicPlus = { "+": [LogicExpression, LogicExpression] };
export type LogicEquals = { "==": [LogicExpression, LogicExpression] };
export type LogicAnd = { and: LogicExpression[] };
export type LogicOr = { or: LogicExpression[] };
export type LogicGreaterEqual = { ">=": [LogicExpression, LogicExpression] };
export type LogicGreater = { ">": [LogicExpression, LogicExpression] };
export type LogicLessEqual = { "<=": [LogicExpression, LogicExpression] };
export type LogicLess = { "<": [LogicExpression, LogicExpression] };

export interface jsonLogic {
  apply: (exp: LogicExpression, data: any) => LogicConstant;
}
