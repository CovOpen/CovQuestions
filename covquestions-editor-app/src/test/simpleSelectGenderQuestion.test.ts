import { QuestionnaireTest } from "./testUtils/QuestionnaireTest";
import testQuestionnaire from "./testCases/simpleSelectGenderQuestion.questionnaire";

describe("Simple select gender question", () => {
  let t: QuestionnaireTest;

  beforeEach(async () => {
    t = new QuestionnaireTest(testQuestionnaire);
  });

  test("The answer female should lead to female", async () => {
    await t.findByText("Geben Sie bitte ihr Geschlecht an?", "legend");
    await t.clickOnAnswer("weiblich");
    await t.clickNext();

    await t.findByText("Geschlecht: Sie haben als Geschlecht 'weiblich' angegeben.");
  });

  test("The answer male should lead to male", async () => {
    await t.findByText("Geben Sie bitte ihr Geschlecht an?", "legend");
    await t.clickOnAnswer("männlich");
    await t.clickNext();

    await t.findByText("Geschlecht: Sie haben als Geschlecht 'männlich' angegeben.");
  });

  test("The answer diverse should lead to diverse", async () => {
    await t.findByText("Geben Sie bitte ihr Geschlecht an?", "legend");
    await t.clickOnAnswer("divers");
    await t.clickNext();

    await t.findByText("Geschlecht: Sie haben als Geschlecht 'divers' angegeben.");
  });
});
