import { EditorQuestion } from "../../../../models/editorQuestionnaire";
import { ElementEditor } from "./ElementEditor";
import questionSchema from "../schemas/question.json";
import React from "react";
import { convertStringToLogicExpression } from "../../converters";
import { duplicatedIdsSelector, editQuestion, questionInEditorSelector } from "../../../../store/questionnaireInEditor";
import { RootState, useAppDispatch } from "../../../../store/store";
import { useSelector } from "react-redux";
import { uiSchemaLogic, uiSchemaLogicReadOnly } from "../schemas/uiSchemaLogic";

export type QuestionInStringRepresentation = Omit<EditorQuestion, "enableWhenExpression"> & {
  enableWhenExpression: string;
};

type QuestionElementEditorProps = {
  index: number;
};

const uiSchema = {
  "ui:order": ["type", "text", "details", "id", "optional", "enableWhenExpressionString", "*"],
  enableWhenExpression: uiSchemaLogicReadOnly(),
  enableWhenExpressionString: uiSchemaLogic(),
  options: {
    items: {
      "ui:order": ["text", "enableWhenExpressionString", "*"],
    },
  },
};

function convertToStringRepresentation(formData: EditorQuestion): QuestionInStringRepresentation {
  return {
    ...formData,
    enableWhenExpression: JSON.stringify(formData.enableWhenExpression, null, 2),
  };
}

export function ElementEditorQuestion(props: QuestionElementEditorProps) {
  const dispatch = useAppDispatch();

  const question = useSelector((state: RootState) => questionInEditorSelector(state, props));
  const duplicatedIds = useSelector((state: RootState) => duplicatedIdsSelector(state));

  const onChange = (formData: QuestionInStringRepresentation, hasErrors: boolean) => {
    dispatch(
      editQuestion({
        index: props.index,
        changedQuestion: formData,
        hasErrors: hasErrors,
      })
    );
  };

  const validate = (formData: QuestionInStringRepresentation, errors: any) => {
    try {
      convertStringToLogicExpression(formData.enableWhenExpressionString);
    } catch (error: any) {
        errors.enableWhenExpressionString.addError(error.message);
    }
    if (duplicatedIds.indexOf(formData.id) > -1) {
      errors.id.addError("Value of ID is duplicated");
    }
  };

  if (question === undefined) {
    return null;
  }

  return (
    <ElementEditor
      id={`editor-question-${props.index}`}
      schema={questionSchema as any}
      formData={convertToStringRepresentation(question)}
      onChange={onChange}
      uiSchema={uiSchema}
      addAdditionalValidationErrors={validate}
    />
  );
}
