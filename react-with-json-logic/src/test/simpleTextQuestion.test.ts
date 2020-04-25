import { QuestionnaireTest } from "./testUtils/QuestionnaireTest";
import testQuestionnaire from "./testCases/simpleTextQuestion.questionnaire";

describe("Simple text question", () => {
  let t: QuestionnaireTest;

  beforeEach(async () => {
    t = new QuestionnaireTest(testQuestionnaire);
  });

  test("Text 'test' should lead to result", async () => {
    await t.findByText("Geben Sie bitte 'test' ein um ein Resultat zu sehen.", "legend");
    await t.enterText("test");
    await t.clickNext();

    await t.findByText("Text: Sie können simple Anweisungen befolgen.");
  });

  test("Wrong text should lead to no result", async () => {
    await t.findByText("Geben Sie bitte 'test' ein um ein Resultat zu sehen.", "legend");
    await t.enterText("Something else");
    await t.clickNext();

    await t.findByText("No result applies");
  });

  test("Skipping the optional question should be possible", async () => {
    await t.findByText("Geben Sie bitte 'test' ein um ein Resultat zu sehen.", "legend");
    await t.clickNext();

    await t.findByText("No result applies");
  });
});
