import { ElementEditor } from "./ElementEditor";
import React from "react";
import resultCategorySchema from "../schemas/resultCategory.json";
import { EditorResult, EditorResultCategory } from "../../../../models/editorQuestionnaire";
import { convertStringToLogicExpression } from "../../converters";
import { RootState, useAppDispatch } from "../../../../store/store";
import { useSelector } from "react-redux";
import {
  duplicatedIdsSelector,
  editResultCategory,
  resultCategoryInEditorSelector,
} from "../../../../store/questionnaireInEditor";
import { uiSchemaLogic, uiSchemaLogicReadOnly } from "../schemas/uiSchemaLogic";

type ResultInStringRepresentation = Omit<EditorResult, "expression"> & {
  expression: string;
};
export type ResultCategoryInStringRepresentation = Omit<EditorResultCategory, "results"> & {
  results: ResultInStringRepresentation[];
};

type ResultElementEditorProps = {
  index: number;
};

const uiSchema = {
  "ui:order": ["", "", "*"],
  results: {
    items: {
      "ui:order": ["id", "text", "expressionString", "*"],
      text: uiSchemaLogic(),
      expression: uiSchemaLogicReadOnly(),
      expressionString: uiSchemaLogic(),
    },
  },
};

function convertToStringRepresentation(formData: EditorResultCategory): ResultCategoryInStringRepresentation {
  return {
    ...formData,
    results: formData?.results?.map((result) => {
      let expression = JSON.stringify(result.expression, null, 2);
      return { ...result, expression };
    }),
  };
}

export function ResultCategoryElementEditor(props: ResultElementEditorProps) {
  const dispatch = useAppDispatch();

  const resultCategory = useSelector((state: RootState) => resultCategoryInEditorSelector(state, props));
  const duplicatedIds = useSelector((state: RootState) => duplicatedIdsSelector(state));

  const onChange = (formData: ResultCategoryInStringRepresentation, hasErrors: boolean) => {
    dispatch(
      editResultCategory({
        index: props.index,
        changedResultCategory: formData,
        hasErrors: hasErrors,
      })
    );
  };

  const validate = (formData: ResultCategoryInStringRepresentation, errors: any) => {
    if (duplicatedIds.indexOf(formData.id) > -1) {
      errors.id.addError("Value of ID is duplicated");
    }

    if (formData.results === undefined) {
      return;
    }
    for (let i = 0; i < formData.results.length; i++) {
      const result = formData.results[i];
      try {
        convertStringToLogicExpression(result.expressionString);
    } catch (error: any) {
        errors.results[i].expressionString.addError(error.message);
      }

      if (duplicatedIds.indexOf(result.id) > -1) {
        errors.results[i].id.addError("Value of ID is duplicated");
      }
    }
  };

  return (
    <ElementEditor
      id={`editor-result-category-${props.index}`}
      schema={resultCategorySchema as any}
      formData={convertToStringRepresentation(resultCategory)}
      onChange={onChange}
      uiSchema={uiSchema}
      addAdditionalValidationErrors={validate}
    />
  );
}
