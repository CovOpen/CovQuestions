import { expectEval } from "./common";

// Those tests utilize json-logic to test for correct evaluation.
describe("Evaluation end-to-end tests", () => {
  expectEval("1 > 2", {}, false);
  expectEval("1 < 2", {}, true);
  expectEval("1 + a", { a: 2 }, 3);
  expectEval("1 - a + b", { a: 2, b: 10 }, 9);
  expectEval(
    'If a * 3 >= 2 and true Then (b - 10) % 1 Else "Test" EndIf',
    { a: 1, b: 10 },
    0
  );
  expectEval(
    'If a * 3 >= 2 and true Then (b - 10) % 1 Else "Test" EndIf',
    { a: -1, b: 10 },
    "Test"
  );
  expectEval("a in [4, 3, 1 + 1]", { a: 2 }, true);
  expectEval('a in [4, 3, "Keks"]', { a: 2 }, false);
});
