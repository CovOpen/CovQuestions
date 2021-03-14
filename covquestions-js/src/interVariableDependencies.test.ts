import { Questionnaire } from "./models/Questionnaire.generated";
import { QuestionnaireEngine } from "./questionnaireEngine";
import { emptyTestQuestionnaire } from "./testUtils/emptyTestQuestionnaire";

describe("questionnaireEngine.interVariableDependencies", () => {
  it("should calculate variable that depends on another variable earlier in the array", () => {
    const var1Id = "v1";
    const var2Id = "v2";
    const var1Value = 42;

    const testQuestionnaire: Questionnaire = {
      ...emptyTestQuestionnaire,
      variables: [
        {
          id: var1Id,
          expression: var1Value,
        },
        {
          id: var2Id,
          expression: {
            var: var1Id,
          },
        },
      ],
    };

    const engine = new QuestionnaireEngine(testQuestionnaire);
    engine.getResults();

    expect(engine.getDataObjectForDeveloping()[var1Id]).toEqual(var1Value);
    expect(engine.getDataObjectForDeveloping()[var2Id]).toEqual(var1Value);
  });

  it("should calculate variable that depends on another variable later in the array", () => {
    const var1Id = "v1";
    const var2Id = "v2";
    const var2Value = 84;

    const testQuestionnaire: Questionnaire = {
      ...emptyTestQuestionnaire,
      variables: [
        {
          id: var1Id,
          expression: {
            var: var2Id,
          },
        },
        {
          id: var2Id,
          expression: var2Value,
        },
      ],
    };

    const engine = new QuestionnaireEngine(testQuestionnaire);
    engine.getResults();

    expect(engine.getDataObjectForDeveloping()[var1Id]).toEqual(var2Value);
    expect(engine.getDataObjectForDeveloping()[var2Id]).toEqual(var2Value);
  });

  it("should quit variable calculation for circular dependencies", () => {
    const var1Id = "v1";
    const var2Id = "v2";

    const testQuestionnaire: Questionnaire = {
      ...emptyTestQuestionnaire,
      variables: [
        {
          id: var1Id,
          expression: {
            "!": {
              var: var2Id,
            },
          },
        },
        {
          id: var2Id,
          expression: {
            var: var1Id,
          },
        },
      ],
    };

    const engine = new QuestionnaireEngine(testQuestionnaire);
    engine.getResults();

    expect(engine.getDataObjectForDeveloping()).not.toBeNull();
  });
});
