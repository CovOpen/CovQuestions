import { EditorVariable } from "../../models/editorQuestionnaire";
import { ElementEditor } from "./ElementEditor";
import React from "react";
import variableSchema from "./formEditorSchemas/variable.json";
import { convertStringToLogicExpression } from "./converters";
import { RootState, useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import { editVariable, variableInEditorSelector } from "../../store/questionnaireInEditor";
import { uiSchemaLogic, uiSchemaLogicReadOnly } from "./formEditorSchemas/uiSchemaLogic";

export type VariableInStringRepresentation = Omit<EditorVariable, "expression"> & { expression: string };

type ElementEditorVariableProps = {
  index: number;
};

const uiSchema = {
  "ui:order": ["id", "expressionString", "*"],
  expression: uiSchemaLogicReadOnly(),
  expressionString: uiSchemaLogic(),
};

function convertToStringRepresentation(formData: EditorVariable): VariableInStringRepresentation {
  return { ...formData, expression: JSON.stringify(formData?.expression, null, 2) };
}

export function ElementEditorVariable(props: ElementEditorVariableProps) {
  const dispatch = useAppDispatch();

  const variable = useSelector((state: RootState) => variableInEditorSelector(state, props));

  const onChange = (formData: VariableInStringRepresentation, hasErrors: boolean) => {
    dispatch(editVariable({ index: props.index, changedVariable: formData, hasErrors: hasErrors }));
  };

  const onValidate = (formData: VariableInStringRepresentation, errors: any) => {
    try {
      convertStringToLogicExpression(formData?.expressionString);
    } catch (error) {
      errors.expressionString.addError(error.message);
    }
  };

  return (
    <ElementEditor
      schema={variableSchema as any}
      formData={convertToStringRepresentation(variable)}
      onChange={onChange}
      uiSchema={uiSchema}
      addAdditionalValidationErrors={onValidate}
    />
  );
}
