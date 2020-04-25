// @ts-ignore
function findClosingBracketMatchIndex(str, pos) {
  // credits to https://codereview.stackexchange.com/questions/179471/find-the-corresponding-closing-parenthesis
  if (str[pos] !== "(") {
    throw new Error("No '(' at index " + pos);
  }
  let depth = 1;
  for (let i = pos + 1; i < str.length; i++) {
    switch (str[i]) {
      case "(":
        depth++;
        break;
      case ")":
        if (--depth === 0) {
          return i;
        }
        break;
    }
  }
  return -1; // No matching closing parenthesis
}

// @ts-ignore
function toJSONDatatype(val) {
  if (val === "null") {
    return null;
  }
  if (val === "true") {
    return true;
  }
  if (val === "false") {
    return false;
  }
  try {
    const pVal = parseFloat(val);
    if (!Number.isNaN(pVal)) {
      return pVal;
    }
  } catch {
    // conversion failed
  }
  return val;
}

export class Expression {
  // raw input text
  public raw: string;
  // parsed input
  public parsed: string;
  // handling of sub expressions
  private depth: number;
  public subExpressions: {
    [exprId: string]: {
      start: number;
      end: number;
      expr: Expression;
    };
  } = {};

  public constructor(a: string, depth: number = 1) {
    this.depth = depth;
    this.raw = a;
    this.parsed = a;
    this.parse();
  }

  public parse() {
    let exprCounter = 0;
    // loop over expression and look for opening parenthesis
    for (let i = 0; i < this.raw.length; i++) {
      if (this.raw[i] === "(") {
        // get the corresponding closing one
        const start = i;
        const end = findClosingBracketMatchIndex(this.raw, start);

        if (end > 0) {
          // extract the subexpression
          const subRepr = this.raw.substring(start + 1, end);
          // create an identifier
          const exprId = "#EXPR" + this.depth + "#" + exprCounter + "#";
          // save subexpression
          this.subExpressions[exprId] = {
            start: start,
            end: end,
            expr: new Expression(subRepr, this.depth + 1 + exprCounter),
          };
          // update parsed string
          this.parsed = this.parsed.replace(subRepr, exprId);
          exprCounter += 1;
          i = end;
        }
      }
    }
  }

  // @ts-ignore
  public toJSONLogic() {
    // sanitze parsed string by adding space around operators
    // note the space after - to avoid casting -1*x wrong!
    const sanitizedRaw = this.parsed
      .replace(/\+/g, " + ")
      .replace(/-\s/g, " - ")
      .replace(/\*/g, " * ")
      .replace(/\//g, " / ")
      .replace(/%/g, " % ")
      .replace(/</g, " < ")
      .replace(/>/g, " > ")
      .replace(/<\s=/g, "<=")
      .replace(/>\s=/g, ">=")
      .replace(/===/g, " === ")
      .replace(/!=/g, " != ")
      .replace(/,\s/g, ",")
      .replace(/\s,/g, ",");
    // split string and filter empty strings
    const elements = sanitizedRaw
      .split(" ")
      .filter((e) => e.length > 0)
      .map((e) => {
        if (e.indexOf(".") === -1 && e.indexOf("#") === -1) {
          return e.toLowerCase();
        } else {
          return e;
        }
      });
    // concatenate everything --> recursive
    return this.chain(elements);
  }

  // @ts-ignore
  public checkExpression(item: any) {
    let nItem = item;
    if (typeof nItem === "string" && item.startsWith("[") && item.endsWith("]")) {
      return nItem
        .slice(1, -1)
        .split(",")
        .filter((e) => e.length > 0)
        .map((e) => this.checkExpression(e));
    }
    // check if it is a subexpression. If so, convert it to JSON Logic
    if (typeof nItem === "string" && item.startsWith("(#") && item.endsWith("#)")) {
      return this.subExpressions[item.slice(1, -1)].expr.toJSONLogic();
    }
    // check if unary operator
    if (typeof nItem === "string" && nItem.startsWith("!")) {
      return {
        "!": this.checkExpression(nItem.slice(1)),
      };
    }
    if (typeof nItem === "string" && nItem.startsWith("-")) {
      return {
        "-": this.checkExpression(nItem.slice(1)),
      };
    }
    // check if is referencing a variable. If so, put in JSON Logic syntax
    if (typeof nItem === "string" && nItem.indexOf(".") > 0) {
      const nItemDotIndex = nItem.indexOf(".");
      if (Number.isNaN(parseFloat(nItem[nItemDotIndex + 1]))) {
        let defaultValue = null;
        let varName = nItem;
        if (nItem.indexOf(":") > 0) {
          const varSplit = nItem.split(":");
          varName = varSplit[0];
          defaultValue = toJSONDatatype(varSplit[1]);
        }
        return { var: [varName, defaultValue] };
      }
    }
    // try to convert numbers/null/...
    if (typeof nItem === "string") {
      return toJSONDatatype(nItem);
    }
    return nItem;
  }

  // @ts-ignore
  public chain(items: any[]) {
    // if only one item, just return it
    if (items.length === 1) {
      return this.checkExpression(items[0]);
    }
    if (items.length === 2 && (items[0] === "max" || items[0] === "min" || items[0] === "+" || items[0] === "*")) {
      const mItems = this.checkExpression(items[1]);
      return {
        [items[0]]: mItems,
      };
    }
    if (items.length === 3) {
      const item0 = this.checkExpression(items[0]);
      const item2 = this.checkExpression(items[2]);
      return {
        [items[1]]: [item0, item2],
      };
    }
    if (
      items.length === 5 &&
      (items[1] === "<" || items[1] === "<=" || items[1] === ">" || items[1] === ">=") &&
      (items[3] === "<" || items[3] === "<=" || items[1] === ">" || items[1] === ">=")
    ) {
      const item0 = this.checkExpression(items[0]);
      const item2 = this.checkExpression(items[2]);
      const item4 = this.checkExpression(items[4]);
      return {
        [items[1]]: [item0, item2, item4],
      };
    }
    if (items.length === 6 && items[0] === "if" && items[2] === "then" && items[4] === "else") {
      const Cond = this.checkExpression(items[1]);
      const Then = this.checkExpression(items[3]);
      const Else = this.checkExpression(items[5]);
      return {
        if: [Cond, Then, Else],
      };
    }
    // else recursively chain them
    return {
      [items[1]]: [this.checkExpression(items[0]), this.chain(items.slice(2))],
    };
  }
}
