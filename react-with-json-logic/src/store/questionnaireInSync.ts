import { createAction, createReducer } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const setQuestionnaireInSync = createAction<boolean>("setQuestionnaireInSync");

export const questionnaireInSync = createReducer(true, (builder) =>
  builder.addCase(setQuestionnaireInSync, (state, action) => {
    return action.payload;
  })
);

export const questionnaireInSyncSelector = (state: RootState) => state.questionnaireInSync;
