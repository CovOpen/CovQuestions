import { createSelector } from "@reduxjs/toolkit";
import { questionnaireInEditorSelector } from "./questionnaireInEditor";

export type AvailableItems = { itemId: string; possibleValues?: any[]; type: string }[];

export const getQuestionIds = createSelector(
  questionnaireInEditorSelector,
  ({ questionnaire }): AvailableItems => {
    return questionnaire.questions.map((question) => {
      let possibleValues;
      switch (question.type) {
        case "select":
          possibleValues = question.options!.map((option) => option.value);
          break;
        case "multiselect":
          possibleValues = question.options!.map((option) => option.value);
          break;
        case "boolean":
          possibleValues = [true, false];
          break;
        case "number":
          break;
        case "date":
          break;
        case "text":
          break;
      }
      return { itemId: question.id, type: question.type, possibleValues };
    });
  }
);

export const getResultCategoryIds = createSelector(
  questionnaireInEditorSelector,
  ({ questionnaire }): AvailableItems => {
    return questionnaire.resultCategories.map((resultCategory) => ({
      itemId: resultCategory.id,
      possibleValues: resultCategory.results.map((result) => result.id),
      type: "select",
    }));
  }
);
