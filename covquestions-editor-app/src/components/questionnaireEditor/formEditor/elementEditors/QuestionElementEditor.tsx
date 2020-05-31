import { EditorAnyQuestion } from "../../../../models/editorQuestionnaire";
import { ElementEditor } from "./ElementEditor";
import questionSchema from "../schemas/question.json";
import React from "react";
import { convertStringToLogicExpression } from "../../converters";
import { editQuestion, questionInEditorSelector, questionsSelector } from "../../../../store/questionnaireInEditor";
import { RootState, useAppDispatch } from "../../../../store/store";
import { useSelector } from "react-redux";
import { uiSchemaLogic, uiSchemaLogicReadOnly } from "../schemas/uiSchemaLogic";

export type QuestionInStringRepresentation = Omit<EditorAnyQuestion, "enableWhenExpression"> & {
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

function convertToStringRepresentation(formData: EditorAnyQuestion): QuestionInStringRepresentation {
  return {
    ...formData,
    enableWhenExpression: JSON.stringify(formData.enableWhenExpression, null, 2),
  };
}

export function ElementEditorQuestion(props: QuestionElementEditorProps) {
  const dispatch = useAppDispatch();

  const question = useSelector((state: RootState) => questionInEditorSelector(state, props));
  const questions = useSelector((state: RootState) => questionsSelector(state));

  const onChange = (formData: QuestionInStringRepresentation, hasErrors: boolean) => {
    dispatch(editQuestion({ index: props.index, changedQuestion: formData, hasErrors: hasErrors }));
  };

  const validate = (formData: QuestionInStringRepresentation, errors: any) => {
    try {
      convertStringToLogicExpression(formData.enableWhenExpressionString);
    } catch (error) {
      errors.enableWhenExpressionString.addError(error.message);
    }
    if (questions.filter(it => it.id === formData.id).length > 1) {
      errors.id.addError("Value of ID is duplicated");
    }
  };

  if (question === undefined) {
    return null;
  }

  return (
    <ElementEditor
      schema={questionSchema as any}
      formData={convertToStringRepresentation(question)}
      onChange={onChange}
      uiSchema={uiSchema}
      addAdditionalValidationErrors={validate}
    />
  );
}
