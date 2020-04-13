import { QuestionnaireTest } from "./testUtils/QuestionnaireTest";
import testQuestionnaire from "./testCases/simpleMultiselectSymptomsQuestion.questionnaire";

describe("Simple multiselect symptoms question", () => {
  let t: QuestionnaireTest;

  beforeEach(async () => {
    t = new QuestionnaireTest(testQuestionnaire);
    await t.start();
  });

  test("Three symptoms", async () => {
    await t.findByText("Welche der folgenden Symptome haben Sie?");
    await t.clickOnAnswer("Husten");
    await t.clickOnAnswer("Fieber");
    await t.clickOnAnswer("Atemnot");
    await t.clickNext();

    await t.findByText("Symptome: Sie haben drei oder mehr Symptome.");
  });

  test("Two symptoms", async () => {
    await t.findByText("Welche der folgenden Symptome haben Sie?");
    await t.clickOnAnswer("Fieber");
    await t.clickOnAnswer("Atemnot");
    await t.clickNext();

    await t.findByText("Symptome: Sie haben ein oder zwei Symptome.");
  });

  test("No symptoms", async () => {
    await t.findByText("Welche der folgenden Symptome haben Sie?");
    await t.clickNext();

    await t.findByText("Symptome: Sie haben keine Symptome.");
  });
});
