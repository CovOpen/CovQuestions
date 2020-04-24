import { createAction, createReducer } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { Questionnaire, QuestionType } from "../models/Questionnaire";
import { SectionType } from "../components/questionnaireEditor/QuestionnaireFormEditor";

export const setQuestionnaireInEditor = createAction<Questionnaire>("setQuestionnaireInEditor");
export const addNewQuestion = createAction("addNewQuestion");
export const addNewResultCategory = createAction("addNewResultCategory");
export const addNewVariable = createAction("addNewVariable");
export const removeItem = createAction<{
  section: SectionType.QUESTIONS | SectionType.RESULT_CATEGORIES | SectionType.VARIABLES;
  index: number;
}>("removeItem");

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
      return action.payload;
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
      return state;
    })
);

export const questionnaireInEditorSelector = (state: RootState) => state.questionnaireInEditor;
