import { expectEx } from "./common";

// TODO(ejoebstl) multiplication and division are missing in logic expression module.

describe("Arithmetic expressions", () => {
  describe("Basic Arithmetic", () => {
    expectEx("1 + 3", { "+": [1, 3] });
    expectEx("2 - 5", { "-": [2, 5] });
    expectEx("1 * 1", { "*": [1, 1] });
    expectEx("2 / 3", { "/": [2, 3] });
    expectEx("2 % 1", { "%": [2, 1] });
    expectEx("2 ÷ 1", { "/": [2, 1] });
    expectEx("-2 * 3", { "*": [-2, 3] });
    expectEx("1+3", { "+": [1, 3] });
    expectEx("1-3", { "-": [1, 3] }); // this one fails currently
    expectEx("1--3", { "-": [1, -3] });
  });

  describe("Unary Plus/Minus for Single Values", () => {
    expectEx("+1", 1);
    expectEx("-1e-3", -1e-3);
    expectEx("+    1.5", 1.5);
    expectEx("-    12132", -12132);
  });

  describe("Unary Plus/Minus for Expressions", () => {
    expectEx("-(1 / 2)", { "-": [0, { "/": [1, 2] }] });
    expectEx("+7 - (1 * 18)", { "-": [7, { "*": [1, 18] }] });
    expectEx("+7 - -(1 * 18)", { "-": [7, { "-": [0, { "*": [1, 18] }] }] });
    expectEx("1/-(7+2)", { "/": [1, { "-": [0, { "+": [7, 2] }] }] });
  });
});
