import { Questionnaire } from "./models/Questionnaire.generated";
import { QuestionnaireEngine } from "./questionnaireEngine";
import { emptyTestQuestionnaire } from "./testUtils/emptyTestQuestionnaire";

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

  describe("should return progress", () => {
    const question1id = "question1id";
    const question2id = "question2id";
    const question3id = "question3id";

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
          type: "boolean",
          enableWhenExpression: {
            var: question1id,
          },
        },
        {
          id: question3id,
          text: "Frage 3?",
          type: "boolean",
          enableWhenExpression: {
            var: question2id,
          },
        },
      ],
    };

    it("normal progress", () => {
      const engine = new QuestionnaireEngine(testQuestionnaire);
      expect(engine.getProgress()).toEqual(0);

      const question1 = engine.nextQuestion();
      engine.setAnswer("question1id", true);
      expect(engine.getProgress()).toEqual(1 / 3);
      expect(question1?.id).toEqual(question1id);

      const question2 = engine.nextQuestion();
      engine.setAnswer("question2id", true);
      expect(engine.getProgress()).toEqual(2 / 3);
      expect(question2?.id).toEqual(question2id);

      const question3 = engine.nextQuestion();
      engine.setAnswer("question3id", true);
      expect(engine.getProgress()).toEqual(1);
      expect(question3?.id).toEqual(question3id);

      const afterLastQuestion = engine.nextQuestion();
      expect(afterLastQuestion).toEqual(undefined);
    });

    it("progress - if last question disabled", () => {
      const engine = new QuestionnaireEngine(testQuestionnaire);
      expect(engine.getProgress()).toEqual(0);

      const question1 = engine.nextQuestion();
      engine.setAnswer("question1id", true);
      expect(engine.getProgress()).toEqual(1 / 3);
      expect(question1?.id).toEqual(question1id);

      const question2 = engine.nextQuestion();
      engine.setAnswer("question2id", false);
      expect(engine.getProgress()).toEqual(1);
      expect(question2?.id).toEqual(question2id);

      const afterLastQuestion = engine.nextQuestion();
      expect(afterLastQuestion).toEqual(undefined);
    });

    it("progress - if almost last question disabled", () => {
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
            type: "boolean",
            enableWhenExpression: {
              var: question1id,
            },
          },
          {
            id: question3id,
            text: "Frage 3?",
            type: "boolean",
          },
        ],
      };
      const engine = new QuestionnaireEngine(testQuestionnaire);
      expect(engine.getProgress()).toEqual(0);

      const question1 = engine.nextQuestion();
      engine.setAnswer("question1id", false);
      expect(engine.getProgress()).toEqual(1 / 3);
      expect(question1?.id).toEqual(question1id);

      const question3 = engine.nextQuestion();
      engine.setAnswer("question3id", true);
      expect(engine.getProgress()).toEqual(1);
      expect(question3?.id).toEqual(question3id);

      const afterLastQuestion = engine.nextQuestion();
      expect(afterLastQuestion).toEqual(undefined);
    });
  });

  describe("inline variables into results", () => {
    it("should inline a number into the result", () => {
      const testQuestionnaire: Questionnaire = {
        ...emptyTestQuestionnaire,
        variables: [
          {
            id: "magic_number",
            expression: 42,
          },
        ],
        resultCategories: [
          {
            id: "rc1",
            description: "rc1 descr",
            results: [
              {
                id: "rc1.1",
                expression: true,
                text: "some text with the number %(magic_number).1f in the middle",
              },
            ],
          },
        ],
      };

      const engine = new QuestionnaireEngine(testQuestionnaire);
      const result = engine.getResults();

      expect(result.results[0]!.result.text).toEqual("some text with the number 42.0 in the middle");
    });
  });

  describe("convert timestamps to date strings", () => {
    it("should convert a timestamp to a date string for format yyyy.mm.dd", () => {
      const testQuestionnaire: Questionnaire = {
        ...emptyTestQuestionnaire,
        variables: [
          {
            id: "converted_date",
            expression: {
              convert_to_date_string: [1617235200, "YYYY.MM.DD"],
            },
          },
        ],
      };

      const engine = new QuestionnaireEngine(testQuestionnaire);
      const result = engine.getVariables();

      expect(result["converted_date"]).toEqual("2021.04.01");
    });

    it("should convert a timestamp to a date string to alternative format", () => {
      const testQuestionnaire: Questionnaire = {
        ...emptyTestQuestionnaire,
        variables: [
          {
            id: "converted_date",
            expression: {
              convert_to_date_string: [1617235200, "dddd, MMMM D YYYY"],
            },
          },
        ],
      };

      const engine = new QuestionnaireEngine(testQuestionnaire);
      const result = engine.getVariables();

      expect(result["converted_date"]).toEqual("Thursday, April 1 2021");
    });

    it("should convert a timestamp to a date string from another variable", () => {
      const testQuestionnaire: Questionnaire = {
        ...emptyTestQuestionnaire,
        variables: [
          {
            id: "date",
            expression: 1617235200, // 2021.04.01
          },
          {
            id: "converted_date",
            expression: {
              convert_to_date_string: [{ var: "date" }, "YYYY.MM.DD"],
            },
          },
        ],
      };

      const engine = new QuestionnaireEngine(testQuestionnaire);
      const result = engine.getVariables();

      expect(result["converted_date"]).toEqual("2021.04.01");
    });

    it("should return emtpy timestamp from timestamp conversion if date is missing", () => {
      const testQuestionnaire: Questionnaire = {
        ...emptyTestQuestionnaire,
        variables: [
          {
            id: "converted_date",
            expression: {
              convert_to_date_string: [undefined, "YYYY.MM.DD"],
            },
          },
        ],
      } as any;

      const engine = new QuestionnaireEngine(testQuestionnaire);
      const result = engine.getVariables();

      expect(result["converted_date"]).toEqual(null);
    });
  });

  describe("round numbers", () => {
    it("round down", () => {
      const testQuestionnaire: Questionnaire = {
        ...emptyTestQuestionnaire,
        variables: [
          {
            id: "round_test",
            expression: {
              round: [2.4],
            },
          },
        ],
      };

      const engine = new QuestionnaireEngine(testQuestionnaire);
      const result = engine.getVariables();

      expect(result["round_test"]).toEqual(2);
    });

    it("round up", () => {
      const testQuestionnaire: Questionnaire = {
        ...emptyTestQuestionnaire,
        variables: [
          {
            id: "round_test",
            expression: {
              round: [2.5],
            },
          },
        ],
      };

      const engine = new QuestionnaireEngine(testQuestionnaire);
      const result = engine.getVariables();

      expect(result["round_test"]).toEqual(3);
    });

    it("round variable", () => {
      const testQuestionnaire: Questionnaire = {
        ...emptyTestQuestionnaire,
        variables: [
          {
            id: "number",
            expression: 3.2,
          },
          {
            id: "round_test",
            expression: {
              round: { var: "number" },
            },
          },
        ],
      };

      const engine = new QuestionnaireEngine(testQuestionnaire);
      const result = engine.getVariables();

      expect(result["round_test"]).toEqual(3);
    });
  });

  describe("log10 numbers", () => {
    it("log10", () => {
      const testQuestionnaire: Questionnaire = {
        ...emptyTestQuestionnaire,
        variables: [
          {
            id: "log10_test",
            expression: {
              log10: [100000],
            },
          },
        ],
      };

      const engine = new QuestionnaireEngine(testQuestionnaire);
      const result = engine.getVariables();

      expect(result["log10_test"]).toEqual(5);
    });

    it("log10 1", () => {
      const testQuestionnaire: Questionnaire = {
        ...emptyTestQuestionnaire,
        variables: [
          {
            id: "log10_test",
            expression: {
              log10: [1],
            },
          },
        ],
      };

      const engine = new QuestionnaireEngine(testQuestionnaire);
      const result = engine.getVariables();

      expect(result["log10_test"]).toEqual(0);
    });

    it("log10 variable", () => {
      const testQuestionnaire: Questionnaire = {
        ...emptyTestQuestionnaire,
        variables: [
          {
            id: "number",
            expression: 0,
          },
          {
            id: "log10_test",
            expression: {
              log10: { var: "number" },
            },
          },
        ],
      };

      const engine = new QuestionnaireEngine(testQuestionnaire);
      const result = engine.getVariables();

      expect(result["log10_test"]).toEqual(Number.NEGATIVE_INFINITY);
    });
  });
});
