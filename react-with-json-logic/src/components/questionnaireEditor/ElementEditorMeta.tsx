import { ElementEditor } from "./ElementEditor";
import questionnaireMetaSchema from "./formEditorSchemas/questionnaireMeta.json";
import React from "react";
import { useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import { editMeta, questionnaireInEditorSelector } from "../../store/questionnaireInEditor";
import { EditorQuestionnaireMeta } from "../../models/editorQuestionnaire";
import { Questionnaire } from "covquestions-js/models/Questionnaire.generated";

const uiSchema = {
  "ui:order": ["title", "*"],
};

function convertToFormEditorRepresentation(questionnaire: Questionnaire): EditorQuestionnaireMeta {
  return {
    ...questionnaire.meta,
    language: questionnaire.language,
    title: questionnaire.title,
  };
}

export function ElementEditorMeta() {
  const dispatch = useAppDispatch();

  const questionnaire = useSelector(questionnaireInEditorSelector);

  return (
    <ElementEditor
      schema={questionnaireMetaSchema as any}
      formData={convertToFormEditorRepresentation(questionnaire.questionnaire)}
      onChange={(formData, hasErrors) => {
        dispatch(editMeta({ changedMeta: formData, hasErrors }));
      }}
      uiSchema={uiSchema}
      addAdditionalValidationErrors={() => {}}
    />
  );
}
