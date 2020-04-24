import { ElementEditor } from "./ElementEditor";
import React from "react";
import resultCategorySchema from "./formEditorSchemas/resultCategory.json";
import { Result, ResultCategory } from "../../models/Questionnaire";
import { convertLogicExpressionToString } from "./converters";
import { RootState, useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import { editResultCategory, resultCategoryInEditorSelector } from "../../store/questionnaireInEditor";
import { uiSchemaLogic, uiSchemaLogicReadOnly } from "./formEditorSchemas/uiSchemaLogic";

type ResultInStringRepresentation = Omit<Result, "value"> & { value: string };
export type ResultCategoryInStringRepresentation = Omit<ResultCategory, "results"> & {
  results: ResultInStringRepresentation[];
};

type ElementEditorResultProps = {
  index: number;
};

const uiSchema = {
  "ui:order": ["", "", "*"],
  results: {
    items: {
      "ui:order": ["id", "text", "valueString", "*"],
      value: uiSchemaLogicReadOnly(),
      valueString: uiSchemaLogic(),
    },
  },
};

function convertToStringRepresentation(formData: ResultCategory): ResultCategoryInStringRepresentation {
  return {
    ...formData,
    results: formData?.results?.map((result) => {
      let value = convertLogicExpressionToString(result.value);
      return { ...result, value };
    }),
  };
}

export function ElementEditorResultCategory(props: ElementEditorResultProps) {
  const dispatch = useAppDispatch();

  const resultCategory = useSelector((state: RootState) => resultCategoryInEditorSelector(state, props));

  const onChange = (formData: ResultCategoryInStringRepresentation) => {
    dispatch(editResultCategory({ index: props.index, changedResultCategory: formData }));
  };

  return (
    <ElementEditor
      schema={resultCategorySchema as any}
      formData={convertToStringRepresentation(resultCategory)}
      onChange={onChange}
      uiSchema={uiSchema}
    />
  );
}
