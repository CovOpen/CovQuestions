import { expectEx, expectE2E } from "./common";

// This test checks the compact representation of associative operations,
// e.g. 1 + 2 + 3 + 4 should yield { "+": [1, 2, 3, 4] }

describe("Compact representation of associative ops", () => {
  describe("Arithmetic Addition", () => {
    expectEx("1 + 2 + 3 + 4", { "+": [1, 2, 3, 4] });
    expectEx("1 + 2 - 3 + 4 + 5", {
      "+": [{ "-": [{ "+": [1, 2] }, 3] }, 4, 5],
    });
    expectEx("1 + 2 + (3 + 4)", { "+": [1, 2, { "+": [3, 4] }] });
  });

  describe("Arithmetic Multiplication", () => {
    expectEx("1 * 2 * 3 * 4", { "*": [1, 2, 3, 4] });
    expectEx("1 * 2 * 3 / 5 * 5 * 6 * 7", {
      "*": [{ "/": [{ "*": [1, 2, 3] }, 5] }, 5, 6, 7],
    });
    expectEx("1 * 2 * (3 * 4)", { "*": [1, 2, { "*": [3, 4] }] });
  });

  describe("Logical", () => {
    expectEx("true AND true AND false AND false", {
      and: [true, true, false, false],
    });
    expectEx("true OR true OR false OR false", {
      or: [true, true, false, false],
    });
    expectEx("true OR true AND false OR false AND true OR false", {
      or: [true, { and: [true, false] }, { and: [false, true] }, false],
    });
    expectEx("true AND true OR false AND false OR true AND false", {
      or: [
        { and: [true, true] },
        { and: [false, false] },
        { and: [true, false] },
      ],
    });
  });

  describe("End-To-End", () => {
    expectE2E(
      "true OR true AND false OR false AND true OR false",
      "true or true and false or false and true or false"
    );
    expectE2E(
      "true AND true OR false AND false OR true AND false",
      "true and true or false and false or true and false"
    );
    expectE2E("1 * 2 * 3 / 5 * 5 * 6 * 7", "1 * 2 * 3 / 5 * 5 * 6 * 7");
    expectE2E("1 + 2 - 3 + 4 + 5", "1 + 2 - 3 + 4 + 5");
    expectE2E(
      "true AND 1 * 2 * 3 / 5 * 5 * 6 * 7 > 7 OR false AND false OR 1 + 2 + 3 + 4 < 9 AND false",
      "true and 1 * 2 * 3 / 5 * 5 * 6 * 7 > 7 or false and false or 1 + 2 + 3 + 4 < 9 and false"
    );
  });
});
