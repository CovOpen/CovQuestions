import { expectEx } from "./common";

describe("Arithmetic Operator precedence Tests", () => {
  describe("Left to right - same precedence", () => {
    expectEx("1 / 3 * 2", { "*": [{ "/": [1, 3] }, 2] });
    expectEx("1 * 3 / 2", { "/": [{ "*": [1, 3] }, 2] });
    expectEx("1 + 3 - 2", { "-": [{ "+": [1, 3] }, 2] });
    expectEx("1 - 3 + 2", { "+": [{ "-": [1, 3] }, 2] });
  });

  describe("Different precedence", () => {
    expectEx("1 * 3 + 1", { "+": [{ "*": [1, 3] }, 1] });
    expectEx("1 + 3 * 1", { "+": [1, { "*": [3, 1] }] });
  });
});

describe("Logic Operator precedence Tests", () => {
  expectEx("1 AND 2 OR 3 AND 4", { or: [{ and: [1, 2] }, { and: [3, 4] }] });
  expectEx("1 OR 2 AND 3 OR 4", { or: [1, { and: [2, 3] }, 4] });
  expectEx("!1 AND !2 AND !3 OR 4", {
    or: [{ and: [{ "!": 1 }, { "!": 2 }, { "!": 3 }] }, 4],
  });
});

describe("Paranteses Tests", () => {
  expectEx("1 * (3 + 1)", { "*": [1, { "+": [3, 1] }] });
  expectEx("(1 * 3) + 1", { "+": [{ "*": [1, 3] }, 1] });
  expectEx("1 * 3 + 1", { "+": [{ "*": [1, 3] }, 1] });
  expectEx("1 OR (3 AND 1)", { or: [1, { and: [3, 1] }] });
  expectEx("(1 OR 3) AND 1", { and: [{ or: [1, 3] }, 1] });
  expectEx("1 OR 3 AND 1", { or: [1, { and: [3, 1] }] });

  // Note those two expressions are different!
  expectEx("1 - (2 + 2)", { "-": [1, { "+": [2, 2] }] });
  expectEx("1 - 2 + 2", { "+": [{ "-": [1, 2] }, 2] });

  // Note those four expressions are the same!
  expectEx("1 + (2 - 2)", { "+": [1, { "-": [2, 2] }] });
  expectEx("(1 + 2) - 2", { "-": [{ "+": [1, 2] }, 2] });
  expectEx("(1 + 2 - 2)", { "-": [{ "+": [1, 2] }, 2] });
  expectEx("1 + 2 - 2", { "-": [{ "+": [1, 2] }, 2] });
});

describe("Nested Operator precedence tests", () => {
  expectEx("5 < 2 AND (0 * 8 > 2 + 7 OR 1 < 2)", {
    and: [
      { "<": [5, 2] },
      { or: [{ ">": [{ "*": [0, 8] }, { "+": [2, 7] }] }, { "<": [1, 2] }] },
    ],
  });
});
