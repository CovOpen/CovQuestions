import React, { useEffect, useState } from "react";
import "jsoneditor-react/es/editor.min.css";
import { Questionnaire } from "../../models/Questionnaire";
import "brace";
import "brace/mode/json";
import "brace/theme/github";
// @ts-ignore
import { JsonEditor as Editor } from "jsoneditor-react";
// @ts-ignore
import jsonschema from "jsonschema";
import Ajv from "ajv";
import { useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import { questionnaireJsonSelector, setQuestionnaireInEditor } from "../../store/questionnaireInEditor";

type QuestionnaireFormEditorProps = {
  heightWithoutEditor: number;
  schema: jsonschema.Schema;
};

const ajv = new Ajv({ allErrors: true, verbose: true });

export const QuestionnaireJsonEditor: React.FC<QuestionnaireFormEditorProps> = ({ heightWithoutEditor, schema }) => {
  const dispatch = useAppDispatch();
  const questionnaireJson = useSelector(questionnaireJsonSelector);

  const [editorReference, setEditorReference] = useState<Editor | undefined>(undefined);
  const [hasFocus, setHasFocus] = useState(false);

  const style = `
  .jsoneditor {
    height: calc(100vh - ${heightWithoutEditor}px);
  }
  `;

  useEffect(() => {
    if (editorReference === undefined) {
      return;
    }
    if (hasFocus) {
      return;
    }

    editorReference.jsonEditor.set(questionnaireJson);
  }, [questionnaireJson, hasFocus, editorReference]);

  return (
    <div>
      <style>{style}</style>
      <Editor
        ref={(ref: Editor) => setEditorReference(ref)}
        value={questionnaireJson}
        ajv={ajv}
        mode="code"
        theme="ace/theme/github"
        schema={schema}
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
        onChange={(newQuestionnaire: Questionnaire) => {
          dispatch(setQuestionnaireInEditor(newQuestionnaire));
        }}
      />
    </div>
  );
};
