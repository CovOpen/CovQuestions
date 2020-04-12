import * as jestDateMock from "jest-date-mock";
import { QuestionnaireTest } from "./testUtils/QuestionnaireTest";
import testQuestionnaire from "./testCases/contactQuestionWithDateVariableAndSkippingQuestion.questionnaire";

describe("Contact question with date variable and skipping a question", () => {
  let t: QuestionnaireTest;

  beforeEach(async () => {
    t = new QuestionnaireTest(testQuestionnaire);
    await t.start();
  });

  test("No contact should lead to NO_CONTACT result", async () => {
    await t.findByText("Gab es Kontakt zu bestätigten Fällen?");
    await t.clickOnAnswer("no");
    await t.clickNext();

    await t.findByText("Kontakt: Sie hatten keinen Kontakt.");
  });

  test("Contact, but longer than two weeks ago, should lead to CONTACT_NOT_RELEVANT result", async () => {
    jestDateMock.advanceTo(new Date(Date.parse("2020-03-18")));

    await t.findByText("Gab es Kontakt zu bestätigten Fällen?");
    await t.clickOnAnswer("yes");
    await t.clickNext();

    await t.findByText("Wann trat der Kontakt auf?");
    await t.enterDate("2020-03-01");
    await t.clickNext();

    await t.findByText("Kontakt: Sie hatten keinen relevanten Kontakt.");

    jestDateMock.clear();
  });

  test("Contact within the last two weeks should lead to CONTACT_RELEVANT result", async () => {
    jestDateMock.advanceTo(new Date(Date.parse("2020-03-18")));

    await t.findByText("Gab es Kontakt zu bestätigten Fällen?");
    await t.clickOnAnswer("yes");
    await t.clickNext();

    await t.findByText("Wann trat der Kontakt auf?");
    await t.enterDate("2020-03-14");
    await t.clickNext();

    await t.findByText("Kontakt: Sie hatten einen relevanten Kontakt.");

    jestDateMock.clear();
  });
});
