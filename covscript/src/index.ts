import { CovscriptParser } from "./parser";
import { CovscriptLexer } from "./lexer";
import { ToJsonLogicTransformer } from "./transformer";
import { LogicExpression } from "covquestions-js/models/Questionnaire.generated";

/**
 * Parses Covscript to JSON-logic
 */
export class CovscriptToJsonLogicConverter {
  private parser: CovscriptParser;
  private lexer: CovscriptLexer;
  private transformer: ToJsonLogicTransformer;

  /**
   * Creates a new instance that can and should be reused.
   */
  constructor() {
    this.parser = new CovscriptParser();
    this.lexer = new CovscriptLexer();
    this.transformer = new ToJsonLogicTransformer();
  }

  /**
   * Parses the given Covscript Expression
   * @param expressionText The Covscript Expresssion as string
   */
  public parse(expressionText: string): LogicExpression {
    const lexed = this.lexer.tokenize(expressionText);

    if (lexed.errors && lexed.errors.length > 0) {
      // TODO(ejoebstl): Nicer lexing errors.
      console.log(lexed.errors);
      throw new Error(`Error during lexing: ${lexed.errors[0].message}`);
    }

    this.parser.input = lexed.tokens;
    const cst = this.parser.expression();

    if (this.parser.errors && this.parser.errors.length > 0) {
      // TODO(ejoebstl): Nicer parsing errors.
      console.log(this.parser.errors);
      throw new Error(`Error during parsing: ${this.parser.errors[0].message}`);
    }

    return this.transformer.toLogic(cst);
  }
}
