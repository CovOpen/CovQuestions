import { CovscriptToJsonLogicConverter } from "./src";
import { inspect } from "util";

const parser = new CovscriptToJsonLogicConverter()

console.log(inspect(parser.parse('-2'), { depth: null }))
