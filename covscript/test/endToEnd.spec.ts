import { expectE2E } from "./common";

// Those tests utilize the parser to create an end-to-end situation!
describe("Generator/Parser End-To-End Tests", () => {
  expectE2E(
    "5 < 2 AND (0 * 8 > 2 + 7 OR 1 < 2)",
    "5 < 2 and (0 * 8 > 2 + 7 or 1 < 2)"
  );
  expectE2E(
    "IF 1 == 3 AND 1 != 3 THEN 2 + 5 ELSE 21 + 9 ENDIF",
    "If 1 == 3 and 1 != 3 Then 2 + 5 Else 21 + 9 EndIf"
  );
  expectE2E(
    'If symptoms.husten.selected Then "categoryA" Else "CategoryB" EndIf',
    'If symptoms.husten.selected Then "categoryA" Else "CategoryB" EndIf'
  );

  expectE2E(
    'If "husten" in symptoms.husten.values Then "categoryA" Else "CategoryB" EndIf',
    'If "husten" in symptoms.husten.values Then "categoryA" Else "CategoryB" EndIf'
  );
  expectE2E(
    '"test" in [1, 2, 3, 4 + 2 - 3, 5]',
    '"test" in [1, 2, 3, 4 + 2 - 3, 5]'
  );
  expectE2E(
    '1 > 0 AND 7 - 2 % 3 == 1 OR "Test" != Test',
    '1 > 0 and 7 - 2 % 3 == 1 or "Test" != Test'
  );

  expectE2E(
    '1 > 0 AND 7 - 2 % 3 == 1 OR "Test" != Test',
    '1 > 0 and 7 - 2 % 3 == 1 or "Test" != Test'
  );

  expectE2E("1 - (2 + 2)", "1 - (2 + 2)");
  expectE2E("1 - 2 + 2", "1 - 2 + 2");

  expectE2E("1 + (2 - 2)", "1 + 2 - 2", true);
  expectE2E("1 + 2 - 2", "1 + 2 - 2");

  expectE2E("1 / (2 * 2)", "1 / (2 * 2)");
  expectE2E("1 / 2 * 2", "1 / 2 * 2");

  expectE2E("1 * (2 / 2)", "1 * 2 / 2", true);
  expectE2E("1 * 2 / 2", "1 * 2 / 2");

  expectE2E("1 * (2 % 2)", "1 * 2 % 2", true);
  expectE2E("1 * 2 % 2", "1 * 2 % 2");
});
