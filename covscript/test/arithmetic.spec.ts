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
});
