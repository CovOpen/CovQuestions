import { CovscriptToJsonLogicConverter } from "../src";
import { LogicExpression } from "covquestions-js/models/logicExpression";
import { inspect } from "util";
import { CovscriptGenerator } from "../src/generator";

const parser = new CovscriptToJsonLogicConverter()
const generator = new CovscriptGenerator()

/**
 * Assert equal expression 
 */
// TODO(ejoebstl) remove any here as soon as div and mult are added to logic module.
export function expectEx(text: string, logic: LogicExpression | null | any) {
  test(`Parse ${text.replace(/\s+/g, ' ')} correctly`, () => {
    const parsed = parser.parse(text)

    if(logic === null) {
      // Use this to generate test cases
      console.log(inspect(parsed, { depth: null }))
    } else {
      expect(parsed).toEqual(logic)
    }
  })
}

export function expectGen(logic: LogicExpression | any, text: string | null) {
  test(`Render ${JSON.stringify(logic)} correctly`, () => {
    const rendered = generator.generate(logic)

    if(text === null) {
      // Use this to generate test cases
      console.log(rendered)
    } else {
      expect(rendered).toEqual(text)
    }
  })
}

export function expectE2E(input: string, text: string | null) {
  const parsed = parser.parse(input)
  const rendered = generator.generate(parsed)

  if(text === null) {
    // Use this to generate test cases
    console.log(rendered)
  } else {
    expect(rendered).toEqual(text)
  }

}