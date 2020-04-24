import { Variable } from "../../models/Questionnaire";
import { ElementEditor } from "./ElementEditor";
import React from "react";
import variableSchema from "./formEditorSchemas/variable.json";
import { convertLogicExpressionToString, convertStringToLogicExpression } from "./converters";
import { RootState, useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import { editVariable, variableInEditorSelector } from "../../store/questionnaireInEditor";

type VariableInStringRepresentation = Omit<Variable, "value"> & { value: string };

type ElementEditorVariableProps = {
  index: number;
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
  return { ...formData, value: convertLogicExpressionToString(formData?.value) };
}

function convertToJsonRepresentation(formData: VariableInStringRepresentation): Variable {
  return {
    ...formData,
    value: convertStringToLogicExpression(formData?.value),
  } as Variable;
}

export function ElementEditorVariable(props: ElementEditorVariableProps) {
  const dispatch = useAppDispatch();

  const variable = useSelector((state: RootState) => variableInEditorSelector(state, props));

  const onChange = (formData: VariableInStringRepresentation) => {
    dispatch(editVariable({ index: props.index, changedVariable: convertToJsonRepresentation(formData) }));
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
