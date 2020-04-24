import { ElementEditor } from "./ElementEditor";
import questionnaireMetaSchema from "./formEditorSchemas/questionnaireMeta.json";
import React from "react";
import { useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import { editMeta, metaInEditorSelector } from "../../store/questionnaireInEditor";

const uiSchema = {
  "ui:order": ["title", "*"],
};

export function ElementEditorMeta() {
  const dispatch = useAppDispatch();

  const meta = useSelector(metaInEditorSelector);

  return (
    <ElementEditor
      schema={questionnaireMetaSchema as any}
      formData={meta}
      onChange={(formData) => {
        dispatch(editMeta(formData));
      }}
      uiSchema={uiSchema}
    />
  );
}
