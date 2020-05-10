import { LogicExpression } from "covquestions-js/models/Questionnaire.generated";

type LE = LogicExpression;

interface Handler {
  operator: string;
  exec: (parts: LE[] | LE, precedence: number) => string[];
}

const flatten = (elems) => elems.reduce((agg, val) => [...agg, ...val], []);

/**
 * Generates Covscript from JSON-logic
 */
export class CovscriptGenerator {
  private handlers: Handler[];

  constructor() {
    this.handlers = [
      ...this.multOps.map(([op, p]) => this.genBinaryHandler(op, p)),
      ...this.addOps.map(([op, p]) => this.genBinaryHandler(op, p)),
      ...this.compOps.map(([op, p]) => this.genBinaryHandler(op, p)),
      this.genBinaryHandler("and", 50),
      this.genBinaryHandler("or", 60),
      { operator: "var", exec: (a, b) => this.varHandler(a, b) },
      { operator: "!", exec: (a, b) => this.notHandler(a, b) },
      { operator: "if", exec: (a, b) => this.ifHandler(a, b) },
    ];
  }

  public generate(expression: LogicExpression): string {
    const res = this.generateForNode(expression, 100);

    return res.join("").trim();
  }

  private multOps = [
    ["*", 21],
    ["/", 20],
    ["%", 20],
  ] as [string, number][];
  private addOps = [
    ["+", 31],
    ["-", 30],
  ] as [string, number][];
  private compOps = [
    [">", 40],
    ["<", 40],
    [">=", 40],
    ["<=", 40],
    ["==", 40],
    ["!=", 40],
    ["in", 40],
  ] as [string, number][];

  private genBinaryHandler(op: string, precedence: number) {
    return {
      operator: op,
      exec: (children: LE[], currentPrecedence: number) => {
        if (!Array.isArray(children)) {
          throw new Error(`Invalid binary op parametrization.`);
        }

        const rendered = children.map((c, i) => {
          // Special case: Left-most expression gets "upgraded" to a slightly higher precedence in operator group.
          // In other words, we ignore parantheses for left-to-right rules.
          const p = i === 0 ? precedence + 1 : precedence;
          return this.generateForNode(c, p).join("");
        });

        const inner = [rendered.join(` ${op} `)];

        if (currentPrecedence < precedence) {
          return ["(", ...inner, ")"];
        } else {
          return inner;
        }
      },
    };
  }

  private varHandler(varName: LE | LE[], precedence: number) {
    if (Array.isArray(varName)) {
      throw new Error(`Invalid var node.`);
    }
    return [`${varName}`];
  }

  private notHandler(varName: LE | LE[], precedence: number) {
    if (Array.isArray(varName)) {
      throw new Error(`Invalid negation.`);
    }
    // Logical not has highest precedence, everythign execpt atomic needs braces.
    return ["!", ...this.generateForNode(varName, 1)];
  }

  private ifHandler(params: LE[] | LE, precedence: number) {
    if (!Array.isArray(params) || params.length !== 3) {
      throw new Error(`Invalid condition.`);
    }

    const [condition, trueBranch, falseBranch] = params;

    // If has fixed structure, resets all precedence.
    return [
      "If ",
      ...this.generateForNode(condition, 100),
      " Then ",
      ...this.generateForNode(trueBranch, 100),
      " Else ",
      ...this.generateForNode(falseBranch, 100),
      " EndIf ",
    ];
  }

  private generateForNode(expr: LE, currentPrecedence: number): string[] {
    if (typeof expr === "number") {
      return [`${expr}`];
    }

    if (typeof expr === "string") {
      return [JSON.stringify(expr)];
    }

    if (typeof expr === "boolean") {
      return [`${expr}`];
    }

    if (Array.isArray(expr)) {
      const elems = expr.map((val) => this.generateForNode(val, 100));
      const flat = flatten(elems); // Flatten

      return [`[`, ...flat.join(", "), `]`];
    }

    for (const handler of this.handlers) {
      if (expr[handler.operator] !== undefined) {
        return handler.exec(expr[handler.operator], currentPrecedence);
      }
    }

    throw new Error(`Unknown Expression: ${JSON.stringify(expr)}`);
  }
}
