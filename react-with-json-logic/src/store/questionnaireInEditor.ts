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

export const editMeta = createAction<QuestionnaireMeta>("editMeta");
export const editQuestion = createAction<{ index: number; changedQuestion: QuestionInStringRepresentation }>(
  "editQuestionnaire"
);
export const editResultCategory = createAction<{
  index: number;
  changedResultCategory: ResultCategoryInStringRepresentation;
}>("editResultCategory");
export const editVariable = createAction<{ index: number; changedVariable: VariableInStringRepresentation }>(
  "editVariable"
);

const initialQuestionnaireInEditor: Questionnaire = {
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
};

export const questionnaireInEditor = createReducer(initialQuestionnaireInEditor, (builder) =>
  builder
    .addCase(setQuestionnaireInEditor, (state, action) => {
      return addStringRepresentationToQuestionnaire(action.payload);
    })
    .addCase(addNewQuestion, (state) => {
      state.questions.push({
        id: "newQuestionId",
        text: "new question",
        type: QuestionType.Boolean,
      });
    })
    .addCase(addNewResultCategory, (state) => {
      state.resultCategories.push({
        id: "newResultCategoryId",
        description: "",
        results: [],
      });
    })
    .addCase(addNewVariable, (state) => {
      state.variables.push({
        id: "newVariableId",
        value: "",
      });
    })
    .addCase(removeItem, (state, { payload: { section, index } }) => {
      state[section].splice(index, 1);
    })
    .addCase(swapItemWithNextOne, (state, { payload: { section, index } }) => {
      const tmp = state[section][index];
      state[section][index] = state[section][index + 1];
      state[section][index + 1] = tmp;
    })
    .addCase(editMeta, (state, { payload }) => {
      state.meta = payload;
    })
    .addCase(editQuestion, (state, { payload: { index, changedQuestion } }) => {
      state.questions[index] = {
        ...changedQuestion,
        enableWhen: convertStringToLogicExpression(changedQuestion.enableWhenString),
      };
    })
    .addCase(editResultCategory, (state, { payload: { index, changedResultCategory } }) => {
      state.resultCategories[index] = {
        ...changedResultCategory,
        results: changedResultCategory.results.map((result) => ({
          ...result,
          value: convertStringToLogicExpression(result.valueString),
        })),
      };
    })
    .addCase(editVariable, (state, { payload: { index, changedVariable } }) => {
      state.variables[index] = {
        ...changedVariable,
        value: convertStringToLogicExpression(changedVariable.valueString),
      };
    })
);

export const questionnaireInEditorSelector = (state: RootState) => state.questionnaireInEditor;
export const questionnaireJsonSelector = (state: RootState) =>
  removeStringRepresentationFromQuestionnaire(state.questionnaireInEditor);

export const metaInEditorSelector = (state: RootState) => state.questionnaireInEditor.meta;
export const questionInEditorSelector = (state: RootState, props: { index: number }) =>
  state.questionnaireInEditor.questions[props.index];
export const resultCategoryInEditorSelector = (state: RootState, props: { index: number }) =>
  state.questionnaireInEditor.resultCategories[props.index];
export const variableInEditorSelector = (state: RootState, props: { index: number }) =>
  state.questionnaireInEditor.variables[props.index];
