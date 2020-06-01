import { createAction, createReducer } from "@reduxjs/toolkit";
import { LogicExpression } from "covquestions-js/models/Questionnaire.generated";
import { RootState } from "./store";
import { EditorQuestionnaire, EditorQuestionnaireMeta } from "../models/editorQuestionnaire";
import { SectionType } from "../components/questionnaireEditor/QuestionnaireFormEditor";
import {
  addStringRepresentationToQuestionnaire,
  convertStringToLogicExpression,
  removeStringRepresentationFromQuestionnaire,
  moveRootPropertiesToQuestionnaire,
} from "../components/questionnaireEditor/converters";
import { QuestionInStringRepresentation } from "../components/questionnaireEditor/formEditor/elementEditors/QuestionElementEditor";
import { ResultCategoryInStringRepresentation } from "../components/questionnaireEditor/formEditor/elementEditors/ResultCategoryElementEditor";
import { VariableInStringRepresentation } from "../components/questionnaireEditor/formEditor/elementEditors/VariableElementEditor";
import { TestCase } from "covquestions-js/models/Questionnaire.generated";

type ArraySection =
  | SectionType.QUESTIONS
  | SectionType.RESULT_CATEGORIES
  | SectionType.VARIABLES
  | SectionType.TEST_CASES;

export const setQuestionnaireInEditor = createAction<EditorQuestionnaire>("setQuestionnaireInEditor");
export const setHasErrorsInJsonMode = createAction<boolean>("setHasErrorsInJsonMode");
export const addNewQuestion = createAction("addNewQuestion");
export const addNewResultCategory = createAction("addNewResultCategory");
export const addNewVariable = createAction("addNewVariable");
export const addNewTestCase = createAction("addNewTestCase");

export const removeItem = createAction<{
  section: ArraySection;
  index: number;
}>("removeItem");

export const swapItemWithNextOne = createAction<{
  section: ArraySection;
  index: number;
}>("swapItemWithNextOne");

export const editMeta = createAction<{ changedMeta: EditorQuestionnaireMeta; hasErrors: boolean }>("editMeta");

export const editQuestion = createAction<{
  index: number;
  changedQuestion: QuestionInStringRepresentation;
  hasErrors: boolean;
}>("editQuestionnaire");

export const editResultCategory = createAction<{
  index: number;
  changedResultCategory: ResultCategoryInStringRepresentation;
  hasErrors: boolean;
}>("editResultCategory");

export const editVariable = createAction<{
  index: number;
  changedVariable: VariableInStringRepresentation;
  hasErrors: boolean;
}>("editVariable");

export const editTestCase = createAction<{
  index: number;
  changedTestCase: TestCase;
  hasErrors: boolean;
}>("editTestCase");

export type QuestionnaireWrapper = {
  questionnaire: EditorQuestionnaire;
  errors: {
    hasError: boolean;
    formEditor: {
      meta: boolean;
      questions: { [key: number]: boolean };
      resultCategories: { [key: number]: boolean };
      variables: { [key: number]: boolean };
      testCases: { [key: number]: boolean };
    };
  };
};

const initialQuestionnaireInEditor: QuestionnaireWrapper = {
  questionnaire: {
    id: "",
    schemaVersion: "",
    version: 1,
    language: "none",
    title: "",
    meta: {
      author: "",
      creationDate: "",
      availableLanguages: [],
    },
    questions: [],
    resultCategories: [],
    variables: [],
  },
  errors: {
    hasError: false,
    formEditor: {
      meta: false,
      questions: {},
      resultCategories: {},
      variables: {},
      testCases: {},
    },
  },
};

export const questionnaireInEditor = createReducer(initialQuestionnaireInEditor, (builder) =>
  builder
    .addCase(setQuestionnaireInEditor, (state, action) => {
      state.questionnaire = addStringRepresentationToQuestionnaire(action.payload);
    })
    .addCase(setHasErrorsInJsonMode, (state, { payload }) => {
      state.errors.hasError = payload;
      state.errors.formEditor = {
        meta: false,
        questions: {},
        resultCategories: {},
        variables: {},
        testCases: {},
      };
    })
    .addCase(addNewQuestion, (state) => {
      state.questionnaire.questions.push({
        id: "newQuestionId",
        text: "new question",
        type: "boolean",
      });
    })
    .addCase(addNewResultCategory, (state) => {
      state.questionnaire.resultCategories.push({
        id: "newResultCategoryId",
        description: "",
        results: [],
      });
    })
    .addCase(addNewVariable, (state) => {
      state.questionnaire.variables.push({
        id: "newVariableId",
        expression: "",
      });
    })
    .addCase(addNewTestCase, (state) => {
      if (!state.questionnaire.testCases) {
        state.questionnaire.testCases = [];
      }
      state.questionnaire.testCases.push({
        description: "Description of the new test case",
        answers: {},
        results: {},
      });
    })
    .addCase(removeItem, (state, { payload: { section, index } }) => {
      const questionnaireElement = state.questionnaire[section];
      if (questionnaireElement !== undefined) {
        questionnaireElement.splice(index, 1);
        if (state.errors.formEditor[section][index] !== undefined) {
          delete state.errors.formEditor[section][index];
          let hasErrors = state.errors.formEditor.meta;
          for (const prop of Object.getOwnPropertyNames(state.errors.formEditor.questions)) {
            const hasElementError: boolean = Reflect.get(state.errors.formEditor.questions, prop);
            hasErrors = hasErrors || hasElementError;
          }
          for (const prop of Object.getOwnPropertyNames(state.errors.formEditor.resultCategories)) {
            const hasElementError: boolean = Reflect.get(state.errors.formEditor.resultCategories, prop);
            hasErrors = hasErrors || hasElementError;
          }
          for (const prop of Object.getOwnPropertyNames(state.errors.formEditor.variables)) {
            const hasElementError: boolean = Reflect.get(state.errors.formEditor.variables, prop);
            hasErrors = hasErrors || hasElementError;
          }
          for (const prop of Object.getOwnPropertyNames(state.errors.formEditor.testCases)) {
            const hasElementError: boolean = Reflect.get(state.errors.formEditor.testCases, prop);
            hasErrors = hasErrors || hasElementError;
          }
          state.errors.hasError = hasErrors;
        }
      }
    })
    .addCase(swapItemWithNextOne, (state, { payload: { section, index } }) => {
      const questionnaireElement = state.questionnaire[section];
      if (questionnaireElement !== undefined) {
        const tmp = questionnaireElement[index];
        questionnaireElement[index] = questionnaireElement[index + 1];
        questionnaireElement[index + 1] = tmp;
        const tmpError = state.errors.formEditor[section][index] ?? false;
        state.errors.formEditor[section][index] = state.errors.formEditor[section][index + 1] ?? false;
        state.errors.formEditor[section][index + 1] = tmpError;
      }
    })
    .addCase(editMeta, (state, { payload: { changedMeta, hasErrors } }) => {
      state.questionnaire = moveRootPropertiesToQuestionnaire(state.questionnaire, changedMeta);
      state.errors.formEditor.meta = hasErrors;
      state.errors.hasError = state.errors.hasError || hasErrors;
    })
    .addCase(editQuestion, (state, { payload: { index, changedQuestion, hasErrors } }) => {
      let expression: LogicExpression | undefined = undefined;
      try {
        expression = convertStringToLogicExpression(changedQuestion.enableWhenExpressionString);
      } catch {}
      state.questionnaire.questions[index] = {
        ...changedQuestion,
        enableWhenExpression: expression,
      };
      state.errors.formEditor.questions[index] = hasErrors;
      state.errors.hasError = state.errors.hasError || hasErrors;
    })
    .addCase(editResultCategory, (state, { payload: { index, changedResultCategory, hasErrors } }) => {
      state.questionnaire.resultCategories[index] = {
        ...changedResultCategory,
        results: changedResultCategory.results.map((result) => {
          let expression: LogicExpression = "";
          try {
            expression = convertStringToLogicExpression(result.expressionString) || "";
          } catch {}
          return {
            ...result,
            expression,
          };
        }),
      };
      state.errors.formEditor.resultCategories[index] = hasErrors;
      state.errors.hasError = state.errors.hasError || hasErrors;
    })
    .addCase(editVariable, (state, { payload: { index, changedVariable, hasErrors } }) => {
      let expression: LogicExpression = "";
      try {
        expression = convertStringToLogicExpression(changedVariable.expressionString) || "";
      } catch {}
      state.questionnaire.variables[index] = {
        ...changedVariable,
        expression,
      };
      state.errors.formEditor.resultCategories[index] = hasErrors;
      state.errors.hasError = state.errors.hasError || hasErrors;
    })
    .addCase(editTestCase, (state, { payload: { index, changedTestCase, hasErrors } }) => {
      if (!state.questionnaire.testCases) {
        state.questionnaire.testCases = [];
      }
      state.questionnaire.testCases[index] = changedTestCase;
      state.errors.formEditor.testCases[index] = hasErrors;
      state.errors.hasError = state.errors.hasError || hasErrors;
    })
);

export const questionnaireInEditorSelector = (state: RootState) => state.questionnaireInEditor;
export const questionnaireJsonSelector = (state: RootState) =>
  removeStringRepresentationFromQuestionnaire(state.questionnaireInEditor.questionnaire);

export const metaInEditorSelector = (state: RootState) => state.questionnaireInEditor.questionnaire.meta;
export const questionInEditorSelector = (state: RootState, props: { index: number }) =>
  state.questionnaireInEditor.questionnaire.questions[props.index];
export const resultCategoryInEditorSelector = (state: RootState, props: { index: number }) =>
  state.questionnaireInEditor.questionnaire.resultCategories[props.index];
export const variableInEditorSelector = (state: RootState, props: { index: number }) =>
  state.questionnaireInEditor.questionnaire.variables[props.index];

export const testCaseInEditorSelector = (state: RootState, props: { index: number }) => {
  const testCases = state.questionnaireInEditor.questionnaire.testCases;
  return testCases ? testCases[props.index] : undefined;
};

export const questionsSelector = (state: RootState) => state.questionnaireInEditor.questionnaire.questions;
export const resultCategoriesSelector = (state: RootState) =>
  state.questionnaireInEditor.questionnaire.resultCategories;
export const variablesSelector = (state: RootState) => state.questionnaireInEditor.questionnaire.variables;

export const hasErrorsSelector = (state: RootState) => state.questionnaireInEditor.errors.hasError;

export const formErrorsSelector = (state: RootState) => state.questionnaireInEditor.errors.formEditor;