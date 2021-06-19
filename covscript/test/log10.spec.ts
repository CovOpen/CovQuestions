import { expectEx } from "./common";

describe("Round conversion", () => {
  expectEx("log10 1", {
    log10: 1,
  });

  expectEx("log10 variable", {
    log10: { var: "variable" },
  });

  expectEx("log10 (var1 + var2)", {
    log10: { "+": [{ var: "var1" }, { var: "var2" }] },
  });
});
