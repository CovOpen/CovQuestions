import { IToken, CstNode } from "chevrotain";
import * as T from "./tokens";
import * as L from "covquestions-js/models/Questionnaire.generated";

type BinaryOperator =
  | "in"
  | "or"
  | "and"
  | "-"
  | "+"
  | "*"
  | "/"
  | "=="
  | ">="
  | "<="
  | "!="
  | "<"
  | ">"
  | "%";
type UnaryOperator = "!";

function isAssoicative(op: BinaryOperator | UnaryOperator) {
  return op === "and" || op === "or" || op === "+" || op === "*";
}

export class ToJsonLogicTransformer {
  /**
   * Converts a leaf node to JSON-Logic.
   * @param token The token to convert.
   */
  private tokenToLogic(token: IToken): L.LogicExpression {
    switch (token.tokenType) {
      case T.NumberLiteral:
        return parseFloat(token.image);
      // Trim Quotes and Unsecape literals.
      case T.StringLiteral:
        return JSON.parse(token.image);
      case T.True:
        return true;
      case T.False:
        return false;
      case T.Null:
        return null;
      case T.Identifier:
        return { var: token.image };
      default:
        throw new Error(`Unknown token type: ${token.tokenType.name}`);
    }
  }

  /**
   * Safely gets the single child from a dummy node.
   */
  private unwrap(cst: CstNode): L.LogicExpression {
    const key = Object.keys(cst.children);
    const children = cst.children[key[0]];
    if (key.length > 1 || children.length > 1) {
      throw new Error(
        "CST node had more than one children. This is an internal error."
      );
    }

    return this.parseTokenOrNode(children[0]);
  }

  /**
   * Parses a node or token structure.
   * @param child
   */
  private parseTokenOrNode(child: CstNode | IToken) {
    if (child["name"] !== undefined) {
      return this.toLogic(child as CstNode);
    } else {
      return this.tokenToLogic(child as IToken);
    }
  }

  /**
   * Recursively packas a list of binary operations with the same precedence
   * into a non-flat JSON-logic structure.
   * @param param0 The child expressions.
   * @param param1 The operators between expressions.
   * @param self Accumulator.
   */
  private packList(
    [lhs, rhs, ...tail]: CstNode[],
    [opHead, ...opTail]: IToken[],
    self: L.LogicExpression | null = null
  ): L.LogicExpression {
    if (opHead === undefined) {
      // finished!
      return self;
    }

    const op = this.parseOperator(opHead.image);
    const expr = {} as L.LogicExpression;

    if (self === null) {
      // Left-most clause (bottom of the output tree)
      expr[op] = [this.toLogic(lhs), this.toLogic(rhs)];
      return this.packList(tail, opTail, expr);
    } else {
      // Any other clause

      if (self[op] !== undefined && isAssoicative(op)) {
        // Special case: Associative operation. We can add it to a single
        // statement to allow a more compact representation.
        self[op] = [...self[op], this.toLogic(lhs)];

        return this.packList([rhs, ...tail], opTail, self);
      } else {
        // General case: Non-Associative. We nest in the correct order.
        expr[op] = [self, this.toLogic(lhs)];

        return this.packList([rhs, ...tail], opTail, expr);
      }
    }
  }

  /**
   * Recursively converts a binary expression to JSON-logic
   * @param cst The expression node.
   */
  private binaryToLogic(cst: CstNode): L.LogicExpression {
    const lhs = cst.children["lhs"] as CstNode[];
    const rhs = cst.children["rhs"] as CstNode[];

    if (lhs.length !== 1) {
      throw new Error(
        "Left hand side of binary expression needs to have length one."
      );
    }

    if (rhs === undefined || rhs.length === 0) {
      // This was just a dummy node.
      return this.unwrap(cst);
    } else {
      const operator = cst.children["operator"] as IToken[];

      if (operator === undefined) {
        throw new Error("Operator for binary expression was undefined.");
      }

      if (operator.length !== rhs.length + lhs.length - 1) {
        throw new Error(
          "Incorrect count of operators for binary expression list."
        );
      }

      return this.packList([...lhs, ...rhs], operator);
    }
  }

  /**
   * Normalizes operators in case they have different
   * writing styles.
   */
  private parseOperator(operator: string): UnaryOperator | BinaryOperator {
    switch (operator.toLowerCase()) {
      case "and":
        return "and";
      case "or":
        return "or";
      case "in":
        return "in";
      case "÷":
        return "/";
      default:
        return operator as UnaryOperator | BinaryOperator;
    }
  }

  /**
   * Recursively converts a unary expression to JSON logic.
   * @param cst The expression node.
   */
  private unaryToLogic(cst: CstNode): L.LogicExpression {
    const expression = cst.children["expression"] as CstNode[];
    const operator = cst.children["operator"] as IToken[];

    if (!expression && expression.length !== 1) {
      throw new Error("Expected exactly one expression");
    }

    if (!operator && operator.length !== 1) {
      throw new Error("Expected exactly one operator");
    }

    const op = this.parseOperator(operator[0].image);
    let expr = {} as L.LogicExpression;

    const child = this.toLogic(expression[0]);

    switch (op) {
      // Negation
      case "!":
        expr[op] = child;
        break;
      // Unary plus (which is a no-op)
      case "+":
        expr = child;
        break;
      // Unary minus
      case "-":
        if (typeof child === "number") {
          // Simply negate number
          expr = -child;
        } else {
          // "Hack" a unary minus by subtracting from 0.
          expr["-"] = [0, child];
        }
        break;
    }

    return expr;
  }

  /**
   * Recursively converts an atomic expression to JSON-logic.
   * This happens by unwrapping.
   * @param cst The expression node.
   */
  private atomicToLogic(cst: CstNode): L.LogicExpression {
    const expr = cst.children["expression"] as CstNode[];

    if (!expr && expr.length !== 1) {
      throw new Error("Expected exactly one expression");
    }

    return this.toLogic(expr[0]);
  }

  /**
   * Converts an array, recusively.
   * @param cst
   */
  private arrayToLogic(cst: CstNode): L.LogicExpression {
    const values = cst.children["value"];

    if (!values) {
      throw new Error("Expected array values.");
    }

    // This cast is not completely legal, but our library can not do
    // a typecheck.
    return values.map((value) => this.toLogic(value as CstNode)) as any;
  }

  /**
   * Converts a condition, recusively.
   * @param cst
   */
  private conditionToLogic(cst: CstNode): L.LogicExpression {
    const condition = cst.children["condition"];
    const branchTrue = cst.children["branchTrue"];
    const branchFalse = cst.children["branchFalse"];

    if (!condition || condition.length !== 1) {
      throw new Error("Expected exactly one condition node.");
    }
    if (!branchTrue || branchTrue.length !== 1) {
      throw new Error("Expected exactly one positive branch node.");
    }
    if (!branchFalse || branchFalse.length !== 1) {
      throw new Error("Expected exactly one negative branch node.");
    }

    return {
      if: [
        this.toLogic(condition[0] as CstNode),
        this.toLogic(branchTrue[0] as CstNode),
        this.toLogic(branchFalse[0] as CstNode),
      ],
    };
  }

  /**
   * Main Entrypoint.
   * Converts an expression to JSON-logic.
   */
  public toLogic(cst: CstNode): L.LogicExpression {
    switch (cst.name) {
      case "expression":
        return this.unwrap(cst);
      case "valueInner":
        return this.unwrap(cst);
      case "logicOrExpression":
        return this.binaryToLogic(cst);
      case "logicAndExpression":
        return this.binaryToLogic(cst);
      case "additionExpression":
        return this.binaryToLogic(cst);
      case "multiplicationExpression":
        return this.binaryToLogic(cst);
      case "comparisonExpression":
        return this.binaryToLogic(cst);
      case "atomicExpression":
        return this.atomicToLogic(cst);
      case "unaryOperation":
        return this.unaryToLogic(cst);
      case "array":
        return this.arrayToLogic(cst);
      case "condition":
        return this.conditionToLogic(cst);
      default:
        throw new Error(`Unknown node type: ${cst.name}`);
    }
  }
}
