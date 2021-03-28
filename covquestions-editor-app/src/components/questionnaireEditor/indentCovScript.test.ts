import { indentCovScript } from "./indentCovScript";

describe("indentCovScript", () => {
  it('should indent nested "else if"', () => {
    const input =
      "If q1.option.cough Then 1 Else If q1.option.fever Then 2 Else If q1.option.headache Then 3 Else If q1.option.dizzyness Then 4 Else 0 EndIf  EndIf  EndIf  EndIf";
    const output = `If q1.option.cough Then
  1
Else
  If q1.option.fever Then
    2
  Else
    If q1.option.headache Then
      3
    Else
      If q1.option.dizzyness Then
        4
      Else
        0
      EndIf 
    EndIf 
  EndIf 
EndIf `;

    expect(indentCovScript(input)).toEqual(output);
  });

  it('should indent nested "then if"', () => {
    const input =
      "If v_symptoms_relevant Then If q_flu.option.yes and score.Symptoms > 0 Then score.Symptoms + 1 Else score.Symptoms EndIf Else 0 EndIf";
    const output = `If v_symptoms_relevant Then
  If q_flu.option.yes and score.Symptoms > 0 Then
    score.Symptoms + 1
  Else
    score.Symptoms
  EndIf 
Else
  0
EndIf `;

    expect(indentCovScript(input)).toEqual(output);
  });

  it('should indent nested "else if" and "then if"', () => {
    const input =
      "If v_symptoms_relevant Then If q_flu.option.yes and score.Symptoms > 0 Then score.Symptoms + 1 Else If some_condition Then 42 Else 12 EndIf EndIf Else 0 EndIf";
    const output = `If v_symptoms_relevant Then
  If q_flu.option.yes and score.Symptoms > 0 Then
    score.Symptoms + 1
  Else
    If some_condition Then
      42
    Else
      12
    EndIf 
  EndIf 
Else
  0
EndIf `;

    expect(indentCovScript(input)).toEqual(output);
  });

  it("should handle small and capital letters", () => {
    const input = "If condition Then 12 ELSE 0 endif";
    const output = `If condition Then
  12
ELSE
  0
endif `;

    expect(indentCovScript(input)).toEqual(output);
  });
});
