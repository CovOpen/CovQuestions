import { expectEx } from "./common";

describe("Array Expression", () => {
  describe("Array Parsing", () => {
    expectEx('[1, 2, 3, "Hello"]', [1, 2, 3, "Hello"]);
    expectEx("[1, 2 + 3, (3)]", [1, { "+": [2, 3] }, 3]);
  });

  describe("Array In Operator", () => {
    expectEx("1 in [1, 2, 3]", { in: [1, [1, 2, 3]] });
  });
});
