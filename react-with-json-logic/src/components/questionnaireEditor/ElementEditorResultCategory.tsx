import { ElementEditor } from "./ElementEditor";
import React from "react";
import resultCategorySchema from "./formEditorSchemas/resultCategory.json";
import { Result, ResultCategory } from "../../models/Questionnaire";
import { LogicExpression } from "../../models/LogicExpression";

type ResultInStringRepresentation = Omit<Result, "value"> & { value: string };
type ResultCategoryInStringRepresentation = Omit<ResultCategory, "results"> & {
  results: ResultInStringRepresentation[];
};

type ElementEditorResultProps = {
  formData: ResultCategory;
  onChange: (formData: ResultCategory) => void;
};

const uiSchema = {
  "ui:order": ["*"],
  results: {
    items: {
      value: {
        "ui:widget": "textarea",
        "ui:options": {
          rows: 15,
        },
      },
    },
  },
};

function convertToStringRepresentation(formData: ResultCategory): ResultCategoryInStringRepresentation {
  return {
    ...formData,
    results: formData.results?.map((result) => {
      let value = JSON.stringify(result.value, undefined, 2) ?? "";
      return { ...result, value };
    }),
  };
}

function convertToJsonRepresentation(formData: ResultCategoryInStringRepresentation): ResultCategory {
  return {
    ...formData,
    results: formData.results?.map((result) => {
      let value = (result.value !== "" ? JSON.parse(result.value) : undefined) as LogicExpression;
      return { ...result, value };
    }),
  };
}

export function ElementEditorResultCategory(props: ElementEditorResultProps) {
  return (
    <ElementEditor
      schema={resultCategorySchema as any}
      formData={convertToStringRepresentation(props.formData)}
      onChange={(formData) => props.onChange(convertToJsonRepresentation(formData))}
      uiSchema={uiSchema}
    />
  );
}
