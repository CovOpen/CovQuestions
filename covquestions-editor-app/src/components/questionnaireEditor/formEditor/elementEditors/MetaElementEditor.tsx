import { ElementEditor } from "./ElementEditor";
import questionnaireMetaSchema from "../schemas/questionnaireMeta.json";
import React from "react";
import { useAppDispatch } from "../../../../store/store";
import { useSelector } from "react-redux";
import { editMeta, questionnaireInEditorSelector } from "../../../../store/questionnaireInEditor";
import { addRootPropertiesToMetaObject } from "../../converters";

const uiSchema = {
  "ui:order": ["title", "*"],
  creationDate: {
    "ui:widget": "date",
  },
};

export function MetaElementEditor() {
  const dispatch = useAppDispatch();

  const questionnaire = useSelector(questionnaireInEditorSelector);

  return (
    <ElementEditor
      id="editor-meta"
      schema={questionnaireMetaSchema as any}
      formData={addRootPropertiesToMetaObject(questionnaire.questionnaire)}
      onChange={(formData, hasErrors) => {
        dispatch(editMeta({ changedMeta: formData, hasErrors }));
      }}
      uiSchema={uiSchema}
      addAdditionalValidationErrors={() => {}}
    />
  );
}
