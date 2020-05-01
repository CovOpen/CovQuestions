import { createAction, createReducer } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { Questionnaire, QuestionnaireMeta, QuestionType } from "../models/Questionnaire";
import { SectionType } from "../components/questionnaireEditor/QuestionnaireFormEditor";
import {
  addStringRepresentationToQuestionnaire,
  convertStringToLogicExpression,
  removeStringRepresentationFromQuestionnaire,
} from "../components/questionnaireEditor/converters";
import { QuestionInStringRepresentation } from "../components/questionnaireEditor/ElementEditorQuestion";
import { ResultCategoryInStringRepresentation } from "../components/questionnaireEditor/ElementEditorResultCategory";
import { VariableInStringRepresentation } from "../components/questionnaireEditor/ElementEditorVariable";

type ArraySection = SectionType.QUESTIONS | SectionType.RESULT_CATEGORIES | SectionType.VARIABLES;

export const setQuestionnaireInEditor = createAction<Questionnaire>("setQuestionnaireInEditor");
export const setHasErrors = createAction<boolean>("setHasErrors");
export const addNewQuestion = createAction("addNewQuestion");
export const addNewResultCategory = createAction("addNewResultCategory");
export const addNewVariable = createAction("addNewVariable");

export const removeItem = createAction<{
  section: ArraySection;
  index: number;
}>("removeItem");

export const swapItemWithNextOne = createAction<{
  section: ArraySection;
  index: number;
}>("swapItemWithNextOne");

export const editMeta = createAction<{ changedMeta: QuestionnaireMeta; hasErrors: boolean }>("editMeta");
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

export type QuestionnaireWrapper = {
  questionnaire: Questionnaire;
  hasErrors: boolean;
};

const initialQuestionnaireInEditor: QuestionnaireWrapper = {
  questionnaire: {
    id: "",
    schemaVersion: "",
    version: "",
    meta: {
      author: "",
      creationDate: "",
      language: "",
      title: "",
    },
    questions: [],
    resultCategories: [],
    variables: [],
  },
  hasErrors: false,
};

export const questionnaireInEditor = createReducer(initialQuestionnaireInEditor, (builder) =>
  builder
    .addCase(setQuestionnaireInEditor, (state, action) => {
      const result = addStringRepresentationToQuestionnaire(action.payload);
      state.questionnaire = result;
    })
    .addCase(setHasErrors, (state, { payload }) => {
      state.hasErrors = payload;
    })
    .addCase(addNewQuestion, (state) => {
      state.questionnaire.questions.push({
        id: "newQuestionId",
        text: "new question",
        type: QuestionType.Boolean,
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
        value: "",
      });
    })
    .addCase(removeItem, (state, { payload: { section, index } }) => {
      state.questionnaire[section].splice(index, 1);
    })
    .addCase(swapItemWithNextOne, (state, { payload: { section, index } }) => {
      const tmp = state.questionnaire[section][index];
      state.questionnaire[section][index] = state.questionnaire[section][index + 1];
      state.questionnaire[section][index + 1] = tmp;
    })
    .addCase(editMeta, (state, { payload: { changedMeta, hasErrors } }) => {
      state.questionnaire.meta = changedMeta;
      state.hasErrors = hasErrors;
    })
    .addCase(editQuestion, (state, { payload: { index, changedQuestion, hasErrors } }) => {
      state.questionnaire.questions[index] = {
        ...changedQuestion,
        enableWhen: convertStringToLogicExpression(changedQuestion.enableWhenString),
      };
      state.hasErrors = hasErrors;
    })
    .addCase(editResultCategory, (state, { payload: { index, changedResultCategory, hasErrors } }) => {
      state.questionnaire.resultCategories[index] = {
        ...changedResultCategory,
        results: changedResultCategory.results.map((result) => ({
          ...result,
          value: convertStringToLogicExpression(result.valueString),
        })),
      };
      state.hasErrors = hasErrors;
    })
    .addCase(editVariable, (state, { payload: { index, changedVariable, hasErrors } }) => {
      state.questionnaire.variables[index] = {
        ...changedVariable,
        value: convertStringToLogicExpression(changedVariable.valueString),
      };
      state.hasErrors = hasErrors;
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
