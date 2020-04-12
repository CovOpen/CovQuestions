import { QuestionnaireTest } from "./testUtils/QuestionnaireTest";
import testQuestionnaire from "./testCases/simpleBooleanContactQuestion.questionnaire";

describe("Simple boolean contact question", () => {
  let t: QuestionnaireTest;

  beforeEach(async () => {
    t = new QuestionnaireTest(testQuestionnaire);
    await t.start();
  });

  test("The answer 'yes' should lead to the positive result", async () => {
    await t.findByText("Gab es Kontakt zu bestätigten Fällen?");
    await t.clickOnAnswer("yes");
    await t.clickNext();

    await t.findByText("Kontakt: Sie hatten Kontakt.");
  });

  test("The answer 'no' should lead to the negative result", async () => {
    await t.findByText("Gab es Kontakt zu bestätigten Fällen?");
    await t.clickOnAnswer("no");
    await t.clickNext();

    await t.findByText("Kontakt: Sie hatten keinen Kontakt.");
  });
});
