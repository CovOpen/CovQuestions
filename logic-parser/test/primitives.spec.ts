import { expectEx } from "./common";

describe("Primitives", () => {
  describe("Numeric Constants", () => {
    expectEx("8", 8);
    expectEx("1.5", 1.5);
    expectEx("-10", -10);
    expectEx("-1.5", -1.5);
    expectEx("1e+2", 1e2);
  });

  describe("String Constants", () => {
    expectEx('"hello"', "hello");
    expectEx('"hello \\"sir\\""', 'hello "sir"');
  });

  describe("Boolean Constants", () => {
    expectEx("True", true);
    expectEx("False", false);
    expectEx("true", true);
    expectEx("false", false);
    expectEx("TRUE", true);
    expectEx("FALSE", false);
  });

  describe("Variables", () => {
    expectEx("question1", { var: "question1" });
    expectEx("question1.value", { var: "question1.value" });
  });
});
