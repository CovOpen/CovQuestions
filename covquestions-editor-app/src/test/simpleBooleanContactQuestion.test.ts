import { QuestionnaireTest } from "./testUtils/QuestionnaireTest";
import testQuestionnaire from "./testCases/simpleBooleanContactQuestion.questionnaire";

describe("Simple boolean contact question", () => {
  let t: QuestionnaireTest;

  beforeEach(async () => {
    t = new QuestionnaireTest(testQuestionnaire);
  });

  test("The answer 'yes' should lead to the positive result", async () => {
    await t.findByText("Gab es Kontakt zu bestätigten Fällen?", "legend");
    await t.clickOnAnswer("yes");
    await t.clickNext();

    await t.findByText("Kontakt: Sie hatten Kontakt.");
  });

  test("The answer 'no' should lead to the negative result", async () => {
    await t.findByText("Gab es Kontakt zu bestätigten Fällen?", "legend");
    await t.clickOnAnswer("no");
    await t.clickNext();

    await t.findByText("Kontakt: Sie hatten keinen Kontakt.");
  });

  test("The answer should be required", async () => {
    await t.findByText("Gab es Kontakt zu bestätigten Fällen?", "legend");
    await t.clickNext();

    const nextButton = await t.nextButton();
    expect(nextButton).toBeDisabled();

    await t.clickOnAnswer("no");
    await t.clickNext();

    await t.findByText("Kontakt: Sie hatten keinen Kontakt.");
  });
});
