import { Questionnaire } from "./models/Questionnaire.generated";
import { QuestionnaireEngine } from "./questionnaireEngine";
import { emptyTestQuestionnaire } from "./testUtils/emptyTestQuestionnaire";

describe("questionnaireEngine.previousQuestion", () => {
  it("should go back to previous question if not submitted yet", () => {
    const question1id = "question1id";
    const question2id = "question2id";
    const answerQ1 = true;

    const testQuestionnaire: Questionnaire = {
      ...emptyTestQuestionnaire,
      questions: [
        {
          id: question1id,
          text: "Frage 1?",
          type: "boolean",
        },
        {
          id: question2id,
          text: "Frage 2?",
          type: "number",
        },
      ],
    };

    const engine = new QuestionnaireEngine(testQuestionnaire);

    const question1 = engine.nextQuestion();
    expect(question1?.id).toEqual(question1id);
    engine.setAnswer("question1id", answerQ1);
    expect(engine.getDataObjectForDeveloping()[question1id]).toEqual(answerQ1);

    const question2 = engine.nextQuestion();
    expect(question2?.id).toEqual(question2id);

    const previousQuestion = engine.previousQuestion(question2id);
    expect(previousQuestion.question.id).toEqual(question1id);
    expect(previousQuestion.answer).toEqual(answerQ1);

    expect(engine.getDataObjectForDeveloping()[question1id]).toEqual(undefined);
  });

  it("should go back to previous question even if answer has been set", () => {
    const question1id = "question1id";
    const question2id = "question2id";
    const answerQ1 = true;
    const answerQ2 = 123;

    const testQuestionnaire: Questionnaire = {
      ...emptyTestQuestionnaire,
      questions: [
        {
          id: question1id,
          text: "Frage 1?",
          type: "boolean",
        },
        {
          id: question2id,
          text: "Frage 2?",
          type: "number",
        },
      ],
    };

    const engine = new QuestionnaireEngine(testQuestionnaire);

    const question1 = engine.nextQuestion();
    expect(question1?.id).toEqual(question1id);
    engine.setAnswer("question1id", answerQ1);
    expect(engine.getDataObjectForDeveloping()[question1id]).toEqual(answerQ1);

    const question2 = engine.nextQuestion();
    expect(question2?.id).toEqual(question2id);
    engine.setAnswer("question2id", answerQ2);
    expect(engine.getDataObjectForDeveloping()[question2id]).toEqual(answerQ2);

    const previousQuestion = engine.previousQuestion(question2id);
    expect(previousQuestion.question.id).toEqual(question1id);
    expect(previousQuestion.answer).toEqual(answerQ1);

    expect(engine.getDataObjectForDeveloping()[question1id]).toEqual(undefined);
    expect(engine.getDataObjectForDeveloping()[question2id]).toEqual(undefined);
  });
});
