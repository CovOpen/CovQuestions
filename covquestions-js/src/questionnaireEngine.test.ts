import { Questionnaire } from "./models/Questionnaire.generated";
import { QuestionnaireEngine } from "./questionnaireEngine";

describe("questionnaireEngine", () => {
  describe("should calculate scores for select and multiselect questions", () => {
    it("should add scores inside the same question", () => {
      const question1Id = "question1id";
      const q1o1Value = "Question 1 Option 1";
      const q1o2Value = "Question 1 Option 2";

      const testQuestionnaire: Questionnaire = {
        ...emptyTestQuestionnaire,
        questions: [
          {
            id: question1Id,
            text: "Frage ?",
            type: "multiselect",
            options: [
              {
                text: "Option 1",
                value: q1o1Value,
                scores: { scoreId1: 1, scoreId2: 2 },
              },
              {
                text: "Option 2",
                value: q1o2Value,
                scores: { scoreId1: 4, scoreId3: 8 },
              },
              {
                text: "Option 3",
                value: "some other option value",
                scores: { scoreId1: 16, scoreId3: 32 },
              },
            ],
          },
        ],
      };

      const engine = new QuestionnaireEngine(testQuestionnaire);
      engine.setAnswer(question1Id, [q1o1Value, q1o2Value]);
      const dataObject = engine.getDataObjectForDeveloping();

      const expectedScores = { scoreId1: 5, scoreId2: 2, scoreId3: 8 };
      expect(dataObject[question1Id].score).toEqual(expectedScores);
      expect(dataObject.score).toEqual(expectedScores);
    });

    it("should add scores between different questions", () => {
      const question1Id = "question1id";
      const question2Id = "question2id";
      const q1o1Value = "Question 1 Option 1";
      const q2o1Value = "Question 2 Option 1";

      const testQuestionnaire: Questionnaire = {
        ...emptyTestQuestionnaire,
        questions: [
          {
            id: question1Id,
            text: "Frage 1?",
            type: "multiselect",
            options: [
              {
                text: "Option 1",
                value: q1o1Value,
                scores: { scoreId1: 1, scoreId2: 2 },
              },
            ],
          },
          {
            id: question2Id,
            text: "Frage 2?",
            type: "select",
            options: [
              {
                text: "Option 1",
                value: q2o1Value,
                scores: { scoreId1: 4, scoreId3: 8 },
              },
            ],
          },
        ],
      };

      const engine = new QuestionnaireEngine(testQuestionnaire);
      engine.setAnswer(question1Id, [q1o1Value]);
      engine.setAnswer(question2Id, q2o1Value);
      const dataObject = engine.getDataObjectForDeveloping();

      expect(dataObject[question1Id].score).toEqual({
        scoreId1: 1,
        scoreId2: 2,
      });
      expect(dataObject[question2Id].score).toEqual({
        scoreId1: 4,
        scoreId3: 8,
      });
      expect(dataObject.score).toEqual({
        scoreId1: 5,
        scoreId2: 2,
        scoreId3: 8,
      });
    });
  });

  it("should return the progress", () => {
    const question1id = "question1id";
    const question2id = "question2id";

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
    expect(engine.getProgress()).toEqual(0);

    const question1 = engine.nextQuestion();
    engine.setAnswer("question1id", ["Something"]);
    expect(engine.getProgress()).toEqual(0.5);
    expect(question1?.id).toEqual(question1id);

    const question2 = engine.nextQuestion();
    engine.setAnswer("question1id", ["Something"]);
    expect(engine.getProgress()).toEqual(1);
    expect(question2?.id).toEqual(question2id);

    const afterLastQuestion = engine.nextQuestion();
    expect(afterLastQuestion).toEqual(undefined);
  });
});

const emptyTestQuestionnaire: Questionnaire = {
  id: "allQuestionTypes",
  schemaVersion: "1",
  version: 1,
  language: "en",
  title: "All question types",
  meta: {
    author: "Someone",
    availableLanguages: ["en"],
    creationDate: "2020-04-13T13:48:48+0000",
  },
  questions: [],
  variables: [],
  resultCategories: [],
  testCases: [],
};
