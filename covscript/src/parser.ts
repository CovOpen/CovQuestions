import { CstParser } from "chevrotain";
import * as T from "./tokens";

// TODO(ejoebstl) Introduce constants to use instead of string literals.

/**
 * Cst parser
 *
 * We need to trick a little bit to get recursive expressions
 * with operator precedence to work.
 *
 * This parser uses Javascript Operator Precedence:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
 *
 * Here is an example with explainations about how to get recursive expressions
 * to work with a Cst parser:
 * https://github.com/SAP/chevrotain/blob/master/examples/grammars/calculator/calculator_pure_grammar.js
 *
 * TL/DR instead of having a big OR for all expressions, we build a chain with rhs/lhs according to priority.
 * This leads to a large parse tree.
 */

export class CovscriptParser extends CstParser {
  constructor() {
    super(T.AllTokens);
    this.performSelfAnalysis();
  }

  private array = this.RULE("array", () => {
    this.CONSUME(T.LSquare);
    this.MANY_SEP({
      SEP: T.Comma,
      DEF: () => {
        this.SUBRULE(this.expression, { LABEL: "value" });
      },
    });
    this.CONSUME(T.RSquare);
  });

  public value = this.RULE("valueInner", () => {
    this.OR([
      { ALT: () => this.CONSUME(T.StringLiteral) },
      { ALT: () => this.CONSUME(T.NumberLiteral) },
      { ALT: () => this.CONSUME(T.Identifier) },
      { ALT: () => this.CONSUME(T.True) },
      { ALT: () => this.CONSUME(T.False) },
      { ALT: () => this.CONSUME(T.Null) },
      { ALT: () => this.SUBRULE(this.array) },
    ]);
  });

  private unaryOperation = this.RULE("unaryOperation", () => {
    this.CONSUME(T.UnaryOperator, { LABEL: "operator" });
    this.SUBRULE(this.atomicExpression, { LABEL: "expression" });
  });

  public condition = this.RULE("condition", () => {
    this.CONSUME(T.If);
    this.SUBRULE(this.expression, { LABEL: "condition" });
    this.CONSUME(T.Then);
    this.SUBRULE2(this.expression, { LABEL: "branchTrue" });
    this.CONSUME(T.Else);
    this.SUBRULE3(this.expression, { LABEL: "branchFalse" });
    this.CONSUME(T.EndIf);
  });

  // This is our actual parser chain, which
  // is designed to avoid endless left-hand recursion and
  // also takes care of operator precedence.
  public expression = this.RULE("expression", () => {
    this.SUBRULE(this.logicOrExpression);
  });

  private logicOrExpression = this.RULE("logicOrExpression", () => {
    this.SUBRULE(this.logicAndExpression, { LABEL: "lhs" });
    this.MANY(() => {
      this.CONSUME(T.OrOperator, { LABEL: "operator" });
      this.SUBRULE2(this.logicAndExpression, { LABEL: "rhs" });
    });
  });

  private logicAndExpression = this.RULE("logicAndExpression", () => {
    this.SUBRULE(this.comparisonExpression, { LABEL: "lhs" });
    this.MANY(() => {
      this.CONSUME1(T.AndOperator, { LABEL: "operator" });
      this.SUBRULE2(this.comparisonExpression, { LABEL: "rhs" });
    });
  });

  private comparisonExpression = this.RULE("comparisonExpression", () => {
    this.SUBRULE(this.additionExpression, { LABEL: "lhs" });
    this.MANY(() => {
      this.CONSUME(T.ComparisonOperator, { LABEL: "operator" });
      this.SUBRULE2(this.additionExpression, { LABEL: "rhs" });
    });
  });

  private additionExpression = this.RULE("additionExpression", () => {
    this.SUBRULE(this.multiplicationExpression, { LABEL: "lhs" });
    this.MANY(() => {
      this.CONSUME(T.AdditionOperator, { LABEL: "operator" });
      this.SUBRULE2(this.multiplicationExpression, { LABEL: "rhs" });
    });
  });

  private multiplicationExpression = this.RULE(
    "multiplicationExpression",
    () => {
      this.SUBRULE(this.atomicExpression, { LABEL: "lhs" });
      this.MANY(() => {
        this.CONSUME(T.MultiplicationOperator, { LABEL: "operator" });
        this.SUBRULE2(this.atomicExpression, { LABEL: "rhs" });
      });
    }
  );

  // "Atomic" Expression. Avoids endless recursion.
  // This rule allows to break out from a precedence-based chain
  // by using parantheses, an if, or a unary operation
  public atomicExpression = this.RULE("atomicExpression", () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(T.LRound);
          this.SUBRULE(this.expression, { LABEL: "expression" });
          this.CONSUME(T.RRound);
        },
      },
      {
        ALT: () => {
          this.SUBRULE(this.unaryOperation, { LABEL: "expression" });
        },
      },
      {
        ALT: () => {
          this.SUBRULE(this.condition, { LABEL: "expression" });
        },
      },
      {
        ALT: () => {
          this.SUBRULE(this.value, { LABEL: "expression" });
        },
      },
    ]);
  });
}
