import { expectGen } from "./common";

describe("Covscript generator basic tests", () => {
  expectGen({ "+": [1, 2] }, "1 + 2");
  expectGen({ "-": [1, 2] }, "1 - 2");
  expectGen({ "*": [1, 2] }, "1 * 2");
  expectGen({ "*": [1, { "+": [2, 3] }] }, "1 * (2 + 3)");
  expectGen({ if: [1, 2, 3] }, "If 1 Then 2 Else 3 EndIf");
  expectGen({ var: "testQuestion.value" }, "testQuestion.value");
  expectGen([1, 2, 3, 4, 5, 6], "[1, 2, 3, 4, 5, 6]");
  expectGen(true, "true");
  expectGen(false, "false");
  expectGen("Hello", '"Hello"');
});

describe("Covscript generator brace insertion", () => {
  expectGen({ "+": [1, { "-": [2, 2] }] }, "1 + 2 - 2");
  expectGen({ "-": [1, { "+": [2, 2] }] }, "1 - (2 + 2)");
  expectGen({ "-": [1, { "+": [2, 2, 3, 8] }] }, "1 - (2 + 2 + 3 + 8)");
  expectGen({ "/": [1, { "*": [2, 2] }] }, "1 / (2 * 2)");
  expectGen({ "/": [1, { "*": [2, 2, 4, 5] }] }, "1 / (2 * 2 * 4 * 5)");
  expectGen({ "*": [1, { "/": [2, 2] }] }, "1 * 2 / 2");
});

describe("Covscript generator simplification of unary minus expressions.", () => {
  // TODO(ejoebstl) not implemented
});
