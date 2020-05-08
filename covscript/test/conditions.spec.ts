import { expectEx } from "./common";

describe("Conditions", () => {
  describe("Basic Conditions", () => {
    expectEx("IF true THEN 1 ELSE 2 ENDIF", { if: [true, 1, 2] });
    expectEx("IF 1 == 3 AND 1 != 3 THEN 2 + 5 ELSE 21 + 9 ENDIF", {
      if: [
        { and: [{ "==": [1, 3] }, { "!=": [1, 3] }] },
        { "+": [2, 5] },
        { "+": [21, 9] },
      ],
    });
  });

  describe("Nested Conditions", () => {
    const code = `
      If 3 + 2 Then
        "True"
      Else
        If 8 > 4 + 2 Then
          "Totally not True"
        Else
          8 in [1, 2, 3, 4]
        EndIf
      EndIf
    `;

    expectEx(code, {
      if: [
        { "+": [3, 2] },
        "True",
        {
          if: [
            { ">": [8, { "+": [4, 2] }] },
            "Totally not True",
            { in: [8, [1, 2, 3, 4]] },
          ],
        },
      ],
    });
  });
});
