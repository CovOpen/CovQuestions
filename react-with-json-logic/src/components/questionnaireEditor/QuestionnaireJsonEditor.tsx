import React, { useEffect, useState } from "react";
import "jsoneditor-react/es/editor.min.css";
import { Questionnaire } from "covquestions-js/models/Questionnaire.generated";
import "brace";
import "brace/mode/json";
import "brace/theme/github";
// @ts-ignore
import { JsonEditor as Editor } from "jsoneditor-react";
import { JSONSchema7 } from "json-schema";
import Ajv from "ajv";
import { useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import { questionnaireJsonSelector, setHasErrors, setQuestionnaireInEditor } from "../../store/questionnaireInEditor";

type QuestionnaireFormEditorProps = {
  heightWithoutEditor: number;
  schema: JSONSchema7;
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
    border: thin solid #667EEA;
  }
  .jsoneditor-menu {
    background-color: #667EEA;
    border-color: #667EEA;
  }
  .ace-github {
    background: #F7FAFC;
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
        onChange={(newQuestionnaire: Questionnaire) => dispatch(setQuestionnaireInEditor(newQuestionnaire))}
        onValidationError={(errors: []) => {
          const hasErrors = errors.length > 0;
          dispatch(setHasErrors(hasErrors));
        }}
      />
    </div>
  );
};
