import { EditorVariable } from "../../../../models/editorQuestionnaire";
import { ElementEditor } from "./ElementEditor";
import React from "react";
import variableSchema from "../schemas/variable.json";
import { convertStringToLogicExpression } from "../../converters";
import { RootState, useAppDispatch } from "../../../../store/store";
import { useSelector } from "react-redux";
import { duplicatedIdsSelector, editVariable, variableInEditorSelector } from "../../../../store/questionnaireInEditor";
import { uiSchemaLogic, uiSchemaLogicReadOnly } from "../schemas/uiSchemaLogic";

export type VariableInStringRepresentation = Omit<EditorVariable, "expression"> & { expression: string };

type VariableElementEditorProps = {
  index: number;
};

const uiSchema = {
  "ui:order": ["id", "expressionString", "*"],
  expression: uiSchemaLogicReadOnly(),
  expressionString: uiSchemaLogic(),
};

function convertToStringRepresentation(formData: EditorVariable): VariableInStringRepresentation {
  return {
    ...formData,
    expression: JSON.stringify(formData?.expression, null, 2),
  };
}

export function VariableElementEditor(props: VariableElementEditorProps) {
  const dispatch = useAppDispatch();

  const variable = useSelector((state: RootState) => variableInEditorSelector(state, props));
  const duplicatedIds = useSelector((state: RootState) => duplicatedIdsSelector(state));

  const onChange = (formData: VariableInStringRepresentation, hasErrors: boolean) => {
    dispatch(
      editVariable({
        index: props.index,
        changedVariable: formData,
        hasErrors: hasErrors,
      })
    );
  };

  const onValidate = (formData: VariableInStringRepresentation, errors: any) => {
    try {
      convertStringToLogicExpression(formData?.expressionString);
    } catch (error: any) {
      errors.expressionString.addError(error.message);
    }

    if (duplicatedIds.indexOf(formData.id) > -1) {
      errors.id.addError("Value of ID is duplicated");
    }
  };

  return (
    <ElementEditor
      id={`editor-variable-${props.index}`}
      schema={variableSchema as any}
      formData={convertToStringRepresentation(variable)}
      onChange={onChange}
      uiSchema={uiSchema}
      addAdditionalValidationErrors={onValidate}
    />
  );
}
