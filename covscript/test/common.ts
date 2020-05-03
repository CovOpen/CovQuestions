import { CovscriptToJsonLogicConverter } from "../src";
import { LogicExpression } from "covquestions-js/models/logicExpression";
import { inspect } from "util";
import { CovscriptGenerator } from "../src/generator";

const parser = new CovscriptToJsonLogicConverter();
const generator = new CovscriptGenerator();

/**
 * Assert equal expression after parsing.
 */
export function expectEx(text: string, logic: LogicExpression | null | any) {
  test(`Parse ${text.replace(/\s+/g, " ")} correctly`, () => {
    const parsed = parser.parse(text);

    if (logic === null) {
      // Use this to generate test cases
      console.log(inspect(parsed, { depth: null }));
    } else {
      expect(parsed).toEqual(logic);
    }
  });
}

/**
 * Assert equal text after generation.
 */
export function expectGen(logic: LogicExpression | any, text: string | null) {
  test(`Render ${JSON.stringify(logic)} correctly`, () => {
    const rendered = generator.generate(logic);

    if (text === null) {
      // Use this to generate test cases
      console.log(rendered);
    } else {
      expect(rendered).toEqual(text);
    }
  });
}

/**
 * Assert consistent rendering/parsing.
 * 
 * Parse -> Render -> Parse, both parse results must be equal, rendered
 * must be equal to given rendered representation.
 * @param input The input text.
 * @param text The "formatted" result. Might be slightly different, since our
 * parser is a bit flexible.
 */
export function expectE2E(input: string, text: string | null) {
  const parsed = parser.parse(input);
  const rendered = generator.generate(parsed);

  if (text === null) {
    // Use this to generate test cases
    console.log(rendered);
  } else {
    expect(rendered).toEqual(text);

    const reParsed = parser.parse(rendered)
    expect(reParsed).toEqual(parsed)
  }
}
