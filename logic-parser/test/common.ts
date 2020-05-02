import { CovscriptToJsonLogicConverter } from "../src";
import { LogicExpression } from "covquestions-js/models/logicExpression";
import { inspect } from "util";

const parser = new CovscriptToJsonLogicConverter()

/**
 * Assert equal expression 
 */
// TODO(ejoebstl) remove any here as soon as div and mult are added to logic module.
export function expectEx(text: string, logic: LogicExpression | null | any) {
  test(`Parse ${text} correctly`, () => {
    const parsed = parser.parse(text)

    if(logic === null) {
      // Use this to generate test cases
      console.log(inspect(parsed, { depth: null }))
    } else {
      expect(parsed).toEqual(logic)
    }
  })
}