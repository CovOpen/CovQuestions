import { expectEx } from "./common";

describe("Logic expressions", () => {
  describe("Basic logic expressions", () => {
    expectEx("1 > 3", { ">": [1, 3] });
    expectEx("2 < 5", { "<": [2, 5] });
    expectEx("1 >= 1", { ">=": [1, 1] });
    expectEx("2 <= 3", { "<=": [2, 3] });
    expectEx('"Hello" == "Sir"', { "==": ["Hello", "Sir"] });
    expectEx('"Goodbye" != "Madam"', { "!=": ["Goodbye", "Madam"] });
    expectEx("!true", { "!": true });
  });

  describe("Logic operators", () => {
    expectEx("true and true", { and: [true, true] });
    expectEx("true or false", { or: [true, false] });
  });

  describe("Lested logic operators", () => {
    expectEx("1 and 2 or 3 and 4", { or: [{ and: [1, 2] }, { and: [3, 4] }] });
  });
});
