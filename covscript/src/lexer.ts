import { Lexer } from "chevrotain";
import { AllTokens } from "./tokens";

export class CovscriptLexer extends Lexer {
  constructor() {
    super(AllTokens);
  }
}
