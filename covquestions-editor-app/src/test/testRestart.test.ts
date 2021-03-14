import { QuestionnaireTest } from "./testUtils/QuestionnaireTest";
import testQuestionnaire from "./testCases/simpleSelectGenderQuestion.questionnaire";

describe("Restart test", () => {
  let t: QuestionnaireTest;

  beforeEach(async () => {
    t = new QuestionnaireTest(testQuestionnaire);
  });

  test("The answer female should lead to female", async () => {
    await t.findByText("Geben Sie bitte ihr Geschlecht an?");

    await t.clickOnAnswer("weiblich");
    await t.clickRestart();
    await t.clickNext();

    const nextButton = await t.nextButton();
    expect(nextButton.parentElement).toBeDisabled();

    await t.clickOnAnswer("weiblich");
    await t.clickNext();

    await t.findByText("Geschlecht");
    await t.findByText("Sie haben als Geschlecht 'weiblich' angegeben.");
  });
});
