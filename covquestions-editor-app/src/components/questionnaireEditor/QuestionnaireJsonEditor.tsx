import React, { useEffect, useState } from "react";
import "jsoneditor-react/es/editor.min.css";
import { Questionnaire } from "@covopen/covquestions-js";
import "brace";
import "brace/mode/json";
import "brace/theme/github";
// @ts-ignore
import { JsonEditor as Editor } from "jsoneditor-react";
import { JSONSchema7 } from "json-schema";
import Ajv from "ajv";
import { useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import {
  questionnaireJsonSelector,
  setHasErrorsInJsonMode,
  setQuestionnaireInEditor,
} from "../../store/questionnaireInEditor";

type QuestionnaireFormEditorProps = {
  schema: JSONSchema7;
};

const ajv = new Ajv({ allErrors: true, verbose: true });

export const QuestionnaireJsonEditor: React.FC<QuestionnaireFormEditorProps> = ({ schema }) => {
  const dispatch = useAppDispatch();
  const questionnaireJson = useSelector(questionnaireJsonSelector);

  const [editorReference, setEditorReference] = useState<Editor | undefined>(undefined);
  const [hasFocus, setHasFocus] = useState(false);

  const style = `
  .jsoneditor {
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
    <Grid container>
      <style>{style}</style>
      <Editor
        ref={(ref: Editor) => setEditorReference(ref)}
        value={questionnaireJson}
        ajv={ajv}
        // https://github.com/vankop/jsoneditor-react/issues/52
        htmlElementProps={{ style: { width: "100%", height: "100%" } }}
        mode="code"
        theme="ace/theme/github"
        schema={schema}
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
        onChange={(newQuestionnaire: Questionnaire) => dispatch(setQuestionnaireInEditor(newQuestionnaire))}
        onValidationError={(errors: []) => {
          const hasErrors = errors.length > 0;
          dispatch(setHasErrorsInJsonMode(hasErrors));
        }}
      />
    </Grid>
  );
};
