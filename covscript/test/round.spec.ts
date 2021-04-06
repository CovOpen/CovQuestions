import { expectEx } from "./common";

describe("Round conversion", () => {
  expectEx("round 1", {
    round: 1,
  });

  expectEx("round variable", {
    round: { var: "variable" },
  });

  expectEx("round (var1 + var2)", {
    round: { "+": [{ var: "var1" }, { var: "var2" }] },
  });
});
