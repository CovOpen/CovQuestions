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

/**
 * @title LogicIf
 */
export type LogicIf = { if: [LogicExpression, LogicExpression, LogicExpression] };
/**
 * @title LogicReduce
 */
export type LogicReduce = { reduce: [LogicExpression, LogicExpression, LogicExpression] };
/**
 * @title LogicSome
 */
export type LogicSome = { some: [LogicExpression, LogicExpression] };
/**
 * @title LogicIn
 */
export type LogicIn = { in: [LogicExpression, LogicExpression[]] };

// Unary Operands.
/**
 * @title LogicNot
 */
export type LogicNot = { "!": LogicExpression | LogicExpression[] };

// Binary Operands.
/**
 * @title LogicMinus
 */
export type LogicMinus = { "-": [LogicExpression, LogicExpression] };
/**
 * @title LogicPlus
 */
export type LogicPlus = { "+": [LogicExpression, LogicExpression] };
/**
 * @title LogicEquals
 */
export type LogicEquals = { "==": [LogicExpression, LogicExpression] };
/**
 * @title LogicAnd
 */
export type LogicAnd = { and: LogicExpression[] };
/**
 * @title LogicOr
 */
export type LogicOr = { or: LogicExpression[] };
/**
 * @title LogicGreaterEqual
 */
export type LogicGreaterEqual = { ">=": [LogicExpression, LogicExpression] };
/**
 * @title LogicGreater
 */
export type LogicGreater = { ">": [LogicExpression, LogicExpression] };
/**
 * @title LogicLessEqual
 */
export type LogicLessEqual = { "<=": [LogicExpression, LogicExpression] };
/**
 * @title LogicLess
 */
export type LogicLess = { "<": [LogicExpression, LogicExpression] };

export interface jsonLogic {
  apply: (exp: LogicExpression, data: any) => LogicConstant;
}
