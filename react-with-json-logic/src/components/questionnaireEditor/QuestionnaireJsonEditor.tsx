import React, { useEffect, useState } from "react";
import "jsoneditor-react/es/editor.min.css";
import { IQuestionnaire } from "../../logic/schema";
import "brace";
import "brace/mode/json";
import "brace/theme/github";
// @ts-ignore
import { JsonEditor as Editor } from "jsoneditor-react";
// @ts-ignore
import jsonschema from "jsonschema";
import Ajv from "ajv";

type QuestionnaireFormEditorProps = {
  value: IQuestionnaire | undefined;
  onChange: (value: IQuestionnaire) => void;
  formHeight: string;
  schema: jsonschema.Schema;
};

const ajv = new Ajv({ allErrors: true, verbose: true });

export const QuestionnaireJsonEditor: React.FC<QuestionnaireFormEditorProps> = ({
  value,
  formHeight,
  onChange,
  schema,
}) => {
  const [editorReference, setEditorReference] = useState<Editor | undefined>(undefined);
  const [hasFocus, setHasFocus] = useState(false);

  const style = `
  .jsoneditor {
    height: ${formHeight};
  }
  `;

  useEffect(() => {
    if (editorReference === undefined) {
      return;
    }
    if (hasFocus) {
      return;
    }

    editorReference.jsonEditor.set(value);
  }, [value, hasFocus, editorReference]);

  return (
    <div>
      <style>{style}</style>
      <Editor
        ref={(ref: Editor) => setEditorReference(ref)}
        value={value}
        ajv={ajv}
        mode="code"
        theme="ace/theme/github"
        schema={schema}
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
        onChange={(value: IQuestionnaire) => onChange(value)}
      />
    </div>
  );
};
