import { Variable } from "../../models/Questionnaire";
import { ElementEditor } from "./ElementEditor";
import React from "react";
import variableSchema from "./formEditorSchemas/variable.json";
import { convertLogicExpressionToString } from "./converters";
import { RootState, useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import { editVariable, variableInEditorSelector } from "../../store/questionnaireInEditor";
import { uiSchemaLogic, uiSchemaLogicReadOnly } from "./formEditorSchemas/uiSchemaLogic";

export type VariableInStringRepresentation = Omit<Variable, "value"> & { value: string };

type ElementEditorVariableProps = {
  index: number;
};

const uiSchema = {
  "ui:order": ["id", "valueString", "*"],
  value: uiSchemaLogicReadOnly(),
  valueString: uiSchemaLogic(),
};

function convertToStringRepresentation(formData: Variable): VariableInStringRepresentation {
  return { ...formData, value: convertLogicExpressionToString(formData?.value) };
}

export function ElementEditorVariable(props: ElementEditorVariableProps) {
  const dispatch = useAppDispatch();

  const variable = useSelector((state: RootState) => variableInEditorSelector(state, props));

  const onChange = (formData: VariableInStringRepresentation) => {
    dispatch(editVariable({ index: props.index, changedVariable: formData }));
  };

  return (
    <ElementEditor
      schema={variableSchema as any}
      formData={convertToStringRepresentation(variable)}
      onChange={onChange}
      uiSchema={uiSchema}
    />
  );
}
