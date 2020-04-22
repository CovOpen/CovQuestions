import { Variable } from "../../models/Questionnaire";
import { ElementEditor } from "./ElementEditor";
import React from "react";
import variableSchema from "./formEditorSchemas/variable.json";

type VariableInStringRepresentation = Omit<Variable, "value"> & { value: string };

type ElementEditorVariableProps = {
  formData: Variable;
  onChange: (formData: Variable) => void;
};

const uiSchema = {
  "ui:order": ["id", "value"],
  value: {
    "ui:widget": "textarea",
    "ui:options": {
      rows: 15,
    },
  },
};

function convertToStringRepresentation(formData: Variable): VariableInStringRepresentation {
  return { ...formData, value: JSON.stringify(formData.value, undefined, 2) ?? "" };
}

function convertToJsonRepresentation(formData: VariableInStringRepresentation): Variable {
  return {
    ...formData,
    value: formData.value !== "" ? JSON.parse(formData.value) : undefined,
  } as Variable;
}

export function ElementEditorVariable(props: ElementEditorVariableProps) {
  return (
    <ElementEditor
      schema={variableSchema as any}
      formData={convertToStringRepresentation(props.formData)}
      onChange={(formData) => props.onChange(convertToJsonRepresentation(formData))}
      uiSchema={uiSchema}
    />
  );
}
