import { QuestionnaireTest } from "./testUtils/QuestionnaireTest";
import testQuestionnaire from "./testCases/simpleNumericAgeQuestion.questionnaire";

describe("Simple numeric age question", () => {
  let t: QuestionnaireTest;

  beforeEach(async () => {
    t = new QuestionnaireTest(testQuestionnaire);
  });

  test("Age below 18 should lead to the AGE_CHILD result", async () => {
    await t.findByText("Wie alt sind Sie?", "p");
    await t.enterNumber(6);
    await t.clickNext();

    await t.findByText("Alter: Du bist ja noch ein Kind.");
  });

  test("Age above 18 should lead to the AGE_ADULT result", async () => {
    await t.findByText("Wie alt sind Sie?", "p");
    await t.enterNumber(21);
    await t.clickNext();

    await t.findByText("Alter: Sie scheinen erwachsen zu sein.");
  });
});
